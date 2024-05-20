import { appConfig } from "@/config";
import Redis from "ioredis";

let redisInstance: Redis;

export async function initRedis() {
  const options = appConfig.redis;

  const { uri } = options;

  try {
    redisInstance = new Redis(uri, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  } catch (error) {
    console.error("Failed to connect to Redis", error);
    throw error;
  }

  try {
    await redisInstance.connect();
    console.info("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
    throw error;
  }

  return { redisInstance };
}

export async function disconnectRedis() {
  return redisInstance?.disconnect();
}

export { redisInstance };
