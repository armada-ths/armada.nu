import { createEnv } from "@t3-oss/env-nextjs"

export const env = createEnv({
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    SLACK_SALES_HOOK_URL: process.env.SLACK_SALES_HOOK_URL,
    NEXT_PUBLIC_RECAPTCHA_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_KEY
  }
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  /* 	experimental__runtimeEnv: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_PUBLIC_API_URL
	} */
})
