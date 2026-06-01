import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ReadWriteCacheService } from './services/readwrite-cache.service';
import { RedisOptions } from './redis-store-config';

@Module({
  imports: [
    NestCacheModule.registerAsync(RedisOptions),
  ],
  providers: [ReadWriteCacheService],
  exports: [ReadWriteCacheService],
})
export class ReadWriteCacheModule {}
