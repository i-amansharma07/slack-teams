function require(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  DATABASE_URL: require("DATABASE_URL"),
  REDIS_URL: require("REDIS_URL"),
  NEXT_PUBLIC_APP_URL: require("NEXT_PUBLIC_APP_URL"),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  SUPER_ADMIN_EMAIL: require("SUPER_ADMIN_EMAIL"),
  SUPER_ADMIN_PASSWORD: require("SUPER_ADMIN_PASSWORD"),
  RESEND_API_KEY: require("RESEND_API_KEY"),
};
