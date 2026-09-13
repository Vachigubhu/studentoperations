import "dotenv/config";

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }

  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongodbUrl: requiredEnv("MONGODB_URL"),

  jwt: {
    accessSecret: requiredEnv("JWT_ACCESS_SECRET"),
    refreshSecret: requiredEnv("JWT_REFRESH_SECRET"),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  },
} as const;
