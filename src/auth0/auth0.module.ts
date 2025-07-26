import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { Auth0Service } from './services';

@Global()
@Module({
  imports: [HttpModule, RedisModule],
  providers: [Auth0Service],
  exports: [Auth0Service],
})
export class Auth0Module {}
