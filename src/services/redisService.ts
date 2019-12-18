import * as redis from 'redis';
import { Request } from 'express';
import { REDIS_URL, REDIS_DB } from '../config/env.config';
import { logger } from './loggerService';

let redisClient: RedisClient;

class RedisClient {
  client: redis.RedisClient;
  initialized: boolean;

  constructor() {
    this.client = redis.createClient(REDIS_URL);
    this.initialized = false;
  }

  init() {
    return new Promise((resolve) => {
      this.client.on('connect', () => {
        logger.debug('Connected to Redis');
        this.client.select(REDIS_DB, () => {
          logger.debug(`Selected redis database ${REDIS_DB}`);

          this.initialized = true;

          resolve();
        });
      });
    })
  }

  save(req: Request, key: string, value: string) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', 5 * 60, (cacheErr, success) => {
        if (cacheErr) {
          req.logger.error(`Error while saving to redis with key: ${key}`);
          return reject(cacheErr);
        }

        if (!success) {
          req.logger.error(`No success while saving to redis with key: ${key}`);
          return reject(new Error('Could not save to cache'));
        }

        resolve();
      });
    });
  }

  get(req: Request, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) {
          req.logger.error(`error while fetching cache for key: ${key}`);
          return reject(err);
        }

        return resolve(data);
      });
    });
  }
}

export async function getRedisClient() {
  if (!redisClient || !redisClient.initialized) {
    redisClient = redisClient || new RedisClient();

    await redisClient.init();
  }

  return redisClient;
}
