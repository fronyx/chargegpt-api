import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ReadonlyCacheService } from './services/readonly-cache.service';
import { RedisOptions } from './redis-store-config';

@Module({
  imports: [
    NestCacheModule.registerAsync(RedisOptions),
  ],
  providers: [ReadonlyCacheService],
  exports: [ReadonlyCacheService],
})
export class ReadonlyCacheModule {}
