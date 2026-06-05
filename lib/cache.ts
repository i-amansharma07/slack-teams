import { redis } from "@/db/redis";
import { logInfo } from "./logger";

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redis.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      logInfo("error in redis");
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch {
      logInfo("error in redis");
    }
  }

  async del(...keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) await redis.del(...keys);
    } catch {
      logInfo("error in redis");
    }
  }

  async wrap<T>(
    key: string,
    ttlSeconds: number,
    fn: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      logInfo("Cache hit");
      return cached;
    } 
    // else {
    //   logInfo("Cache miss");
    // }

    const fresh = await fn();
    if (fresh !== null && fresh !== undefined) {
      await this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  }
}

export const cache = new CacheService();
