import { createClient } from 'redis';
import { isEmptyString } from '../is-empty-string.function';
import { CacheKey } from '../../models/general/models';

export const redisRwClient = createClient({
  url: `redis://${process.env.redisRwHost}:${process.env.redisPort}`,
  socket: { connectTimeout: 50000 },
});
export const redisRoClient = createClient({
  url: `redis://${process.env.redisRoHost}:${process.env.redisPort}`,
  socket: { connectTimeout: 50000 },
});

export async function initRedisCache(): Promise<void> {
  validateEnv();

  if (!redisRoClient.isOpen) {
    await redisRoClient.connect();
  }

  if (!redisRwClient.isOpen) {
    await redisRwClient.connect();
  }
}

export async function disconnectCache(): Promise<void> {
  if (redisRoClient.isOpen) {
    await redisRoClient.disconnect();
  }

  if (redisRwClient.isOpen) {
    await redisRwClient.disconnect();
  }
}

export async function addToHash(args: { cacheKey: CacheKey; value: any }): Promise<void> {
  try {
    await initRedisCache();
  } catch (err) {
    console.error('Error connecting to cache');
    console.error(err);
    throw err;
  }

  try {
    await redisRwClient.sendCommand(Object.entries(args.value).reduce((acc: any, val: any) => acc.concat(val), ['HSET', args.cacheKey.value]));
  } catch (err) {
    console.error(`Error adding data to hash with the following payload: ${JSON.stringify({
      cacheKey: args.cacheKey,
      value: args.value
    })}`);

    throw err;
  }
}

function validateEnv() {
  if (isEmptyString(process.env.redisRwHost) || isEmptyString(process.env.redisPort) || isEmptyString(process.env.redisRoHost)) {
    throw new Error('Redis configuration not found.');
  }
}
