import Redis from "ioredis";
import { env } from "@/lib/env";
import { logError } from "@/lib/logger";

const proc = process as typeof process & { _redis?: Redis };

function createRedis(): Redis {
  const client = new Redis(env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
    retryStrategy(times) {
      if (times > 5) return null;
      return Math.min(times * 500, 3000);
    },
  });
  client.on("error", (err) => logError(err.message));
  return client;
}

export const redis: Redis = proc._redis ?? (proc._redis = createRedis());
