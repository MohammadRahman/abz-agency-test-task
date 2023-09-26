import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async set(key: string, value: unknown, ttl = 2400) {
    const existingTokens = (await this.cache.get<string[]>('Token')) || [];
    existingTokens.push(value as string);
    return await this.cache.set(key, existingTokens, ttl);
  }
  async testRedisConnection() {
    try {
      // Try to set and retrieve a test value to/from Redis
      const testKey = 'testKey';
      const testValue = 'testValue';
      const ttl = 2400;
      await this.cache.set(testKey, testValue, ttl); // Set a test value with a 60-second TTL
      const retrievedValue = await this.cache.get(testKey);

      if (retrievedValue === testValue) {
        return 'Redis connection test successful';
      } else {
        return 'Redis connection test failed: Retrieved value does not match';
      }
    } catch (error) {
      return `Redis connection test failed: ${error.message}`;
    }
  }
  async get(key: string) {
    return await this.cache.get(key);
  }

  async count(key: string) {
    // const token = await this.cache.incr()
  }
  async del(key: string) {
    await this.cache.del(key);
  }

  async reset() {
    await this.cache.reset();
  }
}
