import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  JWT_SECRET: z.string().default("JWT_SECRET"),
  REDIS_URI: z.string().default("redis://localhost:6379"),
  DB_URL: z
    .string()
    .default("postgres://postgres:mysecretpassword@localhost:5432/postgres"),
});

export const env = envSchema.parse(process.env);
