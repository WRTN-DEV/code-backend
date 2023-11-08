import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export const cacheModuleConfig: CacheModuleOptions = {
  ttl: 0,
  store: redisStore,
  max: 100,
  password: process.env.REDIS_HOST_PASSWORD || '1234',
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};
