import { Injectable } from '@nestjs/common';
import { InternalServerError } from '../../../../../apps/cdk-apps/src/shared';
import { ReadonlyCacheService } from './readonly-cache.service';
import { ReadWriteCacheService } from './readwrite-cache.service';

@Injectable()
export class CacheService {
  constructor(
    private readonly readOnlyCacheService: ReadonlyCacheService,
    private readonly readWriteCacheService: ReadWriteCacheService,
  ) {
  }

  async keys(args: { prefix: string; }): Promise<any> {
    return (this.readOnlyCacheService.cacheManager as any).keys(`${args.prefix}*`);
  }

  async get(args: { key: string; }): Promise<any> {
    try {
      return this.readOnlyCacheService.cacheManager.get(args.key);
    } catch (err) {
      const message = `[CacheService.get] ERROR caused by: ${err.message}, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }

  async sUnion(keys: string[]): Promise<string[]> {
    const redisClient = (this.readOnlyCacheService.cacheManager.store as any).getClient();

    return new Promise<string[]>((resolve) => {
      redisClient.sUnion(...keys, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply);
      });
    });
  }

  async hGetAll(key: string): Promise<{ [key: string]: string }> {
    const redisClient = (this.readOnlyCacheService.cacheManager.store as any).getClient();

    return new Promise<{ [key: string]: string }>((resolve) => {
      redisClient.hGetAll(key, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply);
      });
    });
  }

  async expire(key: string, valueInSeconds: number): Promise<{ [key: string]: string }> {
    const redisClient = (this.readWriteCacheService.cacheManager.store as any).getClient();

    return new Promise<{ [key: string]: string }>((resolve) => {
      redisClient.expire(key, valueInSeconds, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply);
      });
    });
  }


  async hSet(key: string, propertyName: string, value: string): Promise<{ [key: string]: string }> {
    const redisClient = (this.readWriteCacheService.cacheManager.store as any).getClient();

    return new Promise<{ [key: string]: string }>((resolve) => {
      redisClient.hSet(key, propertyName, value, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply);
      });
    });
  }

  async sIsMember(key: string, value: string): Promise<boolean> {
    const redisClient = (this.readOnlyCacheService.cacheManager.store as any).getClient();

    return new Promise<boolean>((resolve) => {
      redisClient.sIsMember(key, value, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply === 1);
      });
    });
  }

  async scan(pattern: string): Promise<string[]> {
    const redisClient = (this.readOnlyCacheService.cacheManager.store as any).getClient();
    let cursor = '0';

    const keys = [];

    return new Promise<string[]>((resolve) => {
      const startScan = () => {
        redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', '100', (err, reply) => {
          if (err) {
            console.error(err);
            throw new InternalServerError(err.message);
          }
  
          cursor = reply[0];
          reply[1].forEach((key) => {
            keys.push(key);
          });
  
          if(cursor === '0') {
            resolve(keys);
          } else {
            startScan();
          }
        });
      }

      startScan();
    });
  }

  async sScan(key: string, value: string): Promise<string[]> {
    const redisClient = (this.readOnlyCacheService.cacheManager.store as any).getClient();

    return new Promise<string[]>((resolve) => {
      const pattern = `*${value}*`;
      redisClient.sScan(key, 0, 'MATCH', pattern, 'COUNT', 1000000000, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply[1]);
      });
    });
  }

  async sAdd(key: string, value: string | string[]): Promise<{ [key: string]: string }> {
    const redisClient = (this.readWriteCacheService.cacheManager.store as any).getClient();

    return new Promise<{ [key: string]: string }>((resolve) => {
      redisClient.sAdd(key, value, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply);
      });
    });
  }

  async set(args: {
    key: string;
    value: any;
    ttl?: number;
  }): Promise<void> {
    try {
      await this.readWriteCacheService.cacheManager.set(args.key, args.value, { ttl: args.ttl ?? 0 });
    } catch (err) {
      const message = `[CacheService.set] ERROR caused by: ${err.message}, payload: ${JSON.stringify(args)}, stack: ${err.stack}`;
      console.error(message);
    }
  }

  async delete(args: { key: string; }): Promise<void> {
    await this.readWriteCacheService.cacheManager.del(args.key);
  }

  async sMembers(args: { key: string }): Promise<string[]> {
    const redisClient = (this.readOnlyCacheService.cacheManager.store as any).getClient();

    return new Promise<string[]>((resolve) => {
      redisClient.sMembers(args.key, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply);
      });
    });
  }

  async sRem(args: { key: string; members: [] }): Promise<void> {
    const redisClient = (this.readWriteCacheService.cacheManager.store as any).getClient();

    new Promise<string[]>((resolve) => {
      redisClient.sRem(args.key, args.members, (err, reply) => {
        if (err) {
          console.error(err);
          throw new InternalServerError(err.message);
        }
        resolve(reply);
      });
    });
  }

  disconnect() {
    (this.readOnlyCacheService.cacheManager.store as any).getClient().end(true);
    (this.readWriteCacheService.cacheManager.store as any).getClient().end(true);
  }
}
