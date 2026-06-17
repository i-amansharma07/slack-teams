/*
Next.js's official startup hook — runs once before any route is served.
This is the only reliable place to run "server is booting" logic.
*/

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { prisma } = await import("@/db/prisma");
    const { redis } = await import("@/db/redis");
    const { logInfo, logError } = await import("@/lib/logger");

    try {
      await prisma.$queryRaw`SELECT 1`;
      logInfo("postgres connected");
    } catch (err) {
      logError(err instanceof Error ? err.message : String(err));
    }

    try {
      await redis.ping();
      logInfo("redis connected");
    } catch (err) {
      logError(err instanceof Error ? err.message : String(err));
    }
  }
}
