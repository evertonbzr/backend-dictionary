import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  // WORDS_API_KEY: z.string(),
  JWT_SECRET: z.string().default("JWT_SECRET"),
});

export const env = envSchema.parse(process.env);
