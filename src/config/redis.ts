import { Redis } from 'ioredis';
import * as env from "./env.js";

class RedisClient {
  private static instance: Redis;

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD,
        retryStrategy(times: number): number | void {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 10,
        enableReadyCheck: true,
      });

      RedisClient.instance.on('connect', () => {
        console.log('✅ Redis connected');
      });

      RedisClient.instance.on('error', (err: Error) => {
        console.error('Redis error:', err);
      });
    }
    return RedisClient.instance;
  }

  public static async disconnect() {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
    }
  }
}

export default RedisClient;