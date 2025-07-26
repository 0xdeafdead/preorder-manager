import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  redis: Redis;
  logger: Logger;
  constructor() {
    this.redis = new Redis({
      password: 'preMGMT',
    });
    this.logger = new Logger(RedisService.name);
  }

  /**
   * @param key name by which the value will be searched
   * @param value data to be stored in cache
   * @param TTL amount of time to expire in seconds
   * @returns a boolean, true if succedd, false if store was not possible
   */
  async storeString(key: string, value: string, TTL: number): Promise<boolean> {
    try {
      await this.redis.set(key, value, 'EX', TTL);
      return true;
    } catch (err) {
      this.logger.error(
        `[RedisService] Could not store string. ${err.message}`,
      );
      return false;
    }
  }

  async retrieveString(key: string): Promise<string | null> {
    try {
      const res = await this.redis.get(key);
      return res;
    } catch (err) {
      this.logger.error(`Could not retrieve string. ${err.message}`);
      return null;
    }
  }

  async storeQueryResult<T>(
    key: string,
    value: T,
    TTL: number,
  ): Promise<boolean> {
    try {
      const json = JSON.stringify(value);
      await this.redis.call('JSON.SET', key, '$', json);
      await this.redis.expire(key, TTL);
      return true;
    } catch (err) {
      this.logger.error(`Could not store JSON object. ${err.message}`);
      return false;
    }
  }

  async retrieveQueryResult<T>(
    key: string,
    path?: string,
  ): Promise<T[] | null> {
    try {
      const data = await this.redis.call('JSON.GET', key, path || '$');
      if (!data) {
        return null;
      }
      return JSON.parse(data as string) as T[];
    } catch (err) {
      this.logger.error(
        `There was an error retrieven JSON object from cache. ${err.message}`,
      );
      return null;
    }
  }

  async mergeObject(
    key: string,
    value: unknown,
    TTL: number,
    path?: string,
  ): Promise<boolean> {
    try {
      const json = JSON.stringify(value);
      await this.redis.call('JSON.MERGE', key, path || '$', json);
      await this.redis.expire(key, TTL);
      return true;
    } catch (err) {
      if (err instanceof Error)
        this.logger.error(`Could not merge JSON object. ${err.message}`);
      return false;
    }
  }

  async deleteKeys(keys: string[]): Promise<boolean | null> {
    return this.redis
      .del(keys)
      .then((res) => res === keys.length)
      .catch((err) => {
        if (err instanceof Error)
          this.logger.error(
            `${err.cause || 'Could not remove keys:'} ${keys.join(', ')}`,
          );
        return null;
      });
  }

  async deletePathInKey(key: string, path: string): Promise<boolean> {
    try {
      const keyDeleted = await this.redis.call('JSON.DEL', key, path);
      if (keyDeleted === 0) {
        //THIS RETURNS AN ARRAY OF THE OBJECTS WITH THE SAME PATH GIVEN.
        //THIS MEANS IT NEVER RETURNS NULL, BUT EMPTY ARRAYS IN CASE NOTHING IS FOUND
        const exists = await this.redis.call('JSON.GET', key, path);
        if (Array.isArray(exists) && exists.length !== 0) {
          this.logger.error(
            `Could not delete object from path ${path} in key ${key} . Null returned`,
          );
          return false;
        }
      }
      return true;
    } catch (err) {
      if (err instanceof Error)
        this.logger.error(
          `Could not delete object from path ${path} in key ${key} . ${err.message}`,
        );
      return false;
    }
  }
}
