import Redis from "ioredis";
import { env } from "@/lib/env";
import { logInfo, logError } from "@/lib/logger";

const globalForRedis = globalThis as unknown as { redis: Redis };

function createRedis() {
  const client = new Redis(env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
    retryStrategy(times) {
      if (times > 5) return null;
      return Math.min(times * 500, 3000);
    },
  });
  client.once("ready", () => logInfo("redis connected"));
  client.on("error", (err) => logError(err.message));
  return client;
}

export const redis = globalForRedis.redis ?? createRedis();

if (env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
