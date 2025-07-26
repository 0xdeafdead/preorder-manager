import { DeepPartialMock } from '../../core/types';
import { RedisService } from '../service';

export const redisServiceMock = (): DeepPartialMock<RedisService> => ({
  storeString: jest.fn(),
  retrieveString: jest.fn(),
  storeQueryResult: jest.fn(),
  retrieveQueryResult: jest.fn(),
  mergeObject: jest.fn(),
  deleteKeys: jest.fn(),
});
