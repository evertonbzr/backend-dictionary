import { redisInstance } from "@/db/redis";
import Redis from "ioredis";
import { RedisKey } from "ioredis/built/utils/RedisCommander";

export async function redisGet<T = string>({
  key,
  redisClient = redisInstance,
}: {
  key: string;
  redisClient?: Redis;
}): Promise<T> {
  const val = await redisClient.get(key);
  if (!val) {
  }
  try {
    return JSON.parse(val as string) as T;
  } catch (error) {
    return val as unknown as T;
  }
}

export async function redisSet({
  key,
  data,
  cacheTimeSeconds = 2 * 60 * 60, // 2 hours
  redisClient = redisInstance,
}: {
  key: string;
  data: any;
  cacheTimeSeconds?: number;
  redisClient?: Redis;
}) {
  const val = typeof data === "object" ? JSON.stringify(data) : data;
  return redisClient.set(key, val, "EX", cacheTimeSeconds);
}

export async function redisDel({
  keys,
  redisClient = redisInstance,
}: {
  keys: RedisKey[];
  redisClient?: Redis;
}) {
  return redisClient.del(keys);
}
