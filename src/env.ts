import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  WORDS_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
