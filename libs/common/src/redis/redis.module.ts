import { ConfigService } from '@nestjs/config';
import type { RedisClientOptions } from 'redis';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { redisStore } from 'cache-manager-redis-yet';
// import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: `redis://:Obaidur12@redis:6379`,
        }),
        ttl: 40000,
        max: 10000,
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
