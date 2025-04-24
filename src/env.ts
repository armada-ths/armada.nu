import { z } from "zod"

const envSchema = z.object({
  SLACK_SALES_HOOK_URL: z.string().min(1),

  NEXT_PUBLIC_API_URL: z.string().min(1),
  NEXT_PUBLIC_RECAPTCHA_KEY: z.string().min(1)
})

export const env = envSchema.parse({
  SLACK_SALES_HOOK_URL: process.env.SLACK_SALES_HOOK_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_RECAPTCHA_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_KEY
})
