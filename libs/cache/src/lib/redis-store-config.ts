import { configService } from '@fronyx/configurations';
import { CacheModuleAsyncOptions } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const storeConfig = {
      store: await redisStore({
        url: `rediss://${configService.getAzureRedisHost()}:${configService.getAzureRedisPort()}`,
        store: 'none',
        ttl: 0,
        password: configService.getAzureRedisPassword(),
      }),
    };

    const client = storeConfig.store.getClient();
    client.on('error', (error) => {
      if (!error.message.includes('Socket closed unexpectedly')) {
        console.error('Redis connection terminated with following error:');
        console.error(error);
      }
    });

    return storeConfig;
  },
};
