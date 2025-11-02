"use server"
import { env } from "@/env"
import { z } from "zod"

const ContactSalesSlackSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  message: z.string()
})

export async function sendToSlack(
  args: z.infer<typeof ContactSalesSlackSchema>
) {
  const result = ContactSalesSlackSchema.safeParse(args)
  if (!result.success) {
    return { success: false }
  }
  const msg = {
    text: `
        # New External Contact Message #\n*Name:* ${args.name}\n*Email:* ${args.email}\n*Phone Number:* ${args.phone}\n*Company:* ${args.company}\n*Description:*\n${args.message
          .split("\n")
          .map(line => `>${line}`)
          .join("\n")}\n`
  }
  try {
    if (typeof env.SLACK_SALES_HOOK_URL !== "string") {
      throw new Error("SLACK_SALES_HOOK_URL must be a string")
    }
    await fetch(env.SLACK_SALES_HOOK_URL, {
      method: "POST",
      body: JSON.stringify(msg),
      headers: {
        "Content-Type": "application/json"
      }
    })
    return { success: true }
  } catch (e) {
    console.warn(e)
    return { success: false }
  }
}

export async function sendOrderToSlack(
  message: string,
  recaptchaToken?: string | null
): Promise<{ success: boolean; error?: string }> {
  // If client uses captcha, validate token server-side
  if (env.NEXT_PUBLIC_RECAPTCHA_KEY || env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    if (!recaptchaToken) {
      return { success: false, error: "Missing reCAPTCHA token" }
    }
    if (!env.RECAPTCHA_SECRET_KEY) {
      return { success: false, error: "Missing RECAPTCHA_SECRET_KEY" }
    }

    try {
      const verifyRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            secret: env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken
          }).toString()
        }
      )

      const verifyJson = (await verifyRes.json()) as {
        success: boolean
        score?: number
        action?: string
        "error-codes"?: string[]
      }

      if (!verifyJson.success) {
        const reason =
          verifyJson["error-codes"]?.join(", ") || "verification failed"
        return { success: false, error: `reCAPTCHA ${reason}` }
      }
    } catch {
      return { success: false, error: "Failed to verify reCAPTCHA" }
    }
  }

  const url = env.SLACK_ORDER_HOOK_URL
  if (!url) {
    return { success: false, error: "Missing SLACK_ORDER_HOOK_URL" }
  }

  // Basic URL validation avoids "Failed to parse URL from ''"
  try {
    new URL(url)
  } catch {
    return { success: false, error: "Invalid SLACK_ORDER_HOOK_URL" }
  }

  const payload = {
    text: message
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store"
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      return { success: false, error: `Slack error ${res.status}: ${body}` }
    }

    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error)?.message || "Network error" }
  }
}
