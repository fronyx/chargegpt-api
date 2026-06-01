import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ReadonlyCacheService {
    constructor(@Inject(CACHE_MANAGER) public cacheManager: Cache) {
    }
}
