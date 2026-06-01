import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ReadWriteCacheService {
    constructor(@Inject(CACHE_MANAGER) public cacheManager: Cache) {
    }
}
