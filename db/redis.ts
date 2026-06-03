import Redis from "ioredis";
import { env } from "@/lib/env";
import { logInfo, logError } from "@/lib/logger";

const globalForRedis = globalThis as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
    retryStrategy(times) {
      if (times > 5) return null;
      return Math.min(times * 500, 3000);
    },
  });

redis.once("ready", () => logInfo("redis connected"));
redis.on("error", (err) => logError(err.message));

if (env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
