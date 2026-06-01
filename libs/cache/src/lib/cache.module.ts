import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { ReadonlyCacheModule } from './readonly-cache.module';
import { ReadWriteCacheModule } from './readwrite-cache.module';

@Module({
  imports: [
    ReadonlyCacheModule,
    ReadWriteCacheModule,
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {
}
