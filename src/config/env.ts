import { z } from "zod";
import "dotenv/config";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "test"]).default("development"),
  RETRY_MAX_ATTEMPTS: z.coerce.number().min(1).default(3),
  RETRY_BASE_DELAY_MS: z.coerce.number().default(100),
  RETRY_MAX_DELAY_MS: z.coerce.number().default(5000),
  MAX_CONCURRENT_FORWARDS: z.coerce.number().min(1).default(10),
  FORWARD_TIMEOUT_MS: z.coerce.number().min(100).default(1000),
  CACHE_MAX_SIZE: z.coerce.number().min(10).default(100),
  CACHE_TTL_MS: z.coerce.number().default(300000),
  LOG_LEVEL: z.string().default("info"),
});

const result = schema.safeParse(process.env);
if (!result.success) {
  console.error("❌ Invalid environment config:", result.error.format());
  process.exit(1);
}
export const config = result.data;
