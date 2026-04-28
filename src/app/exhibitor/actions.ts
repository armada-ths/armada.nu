"use server"
import { env } from "@/env"
import { z } from "zod"

const ContactSalesSlackSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  message: z.string(),
  recaptchaToken: z.string().min(1)
})

const RECAPTCHA_MIN_SCORE = 0.5
const RECAPTCHA_EXPECTED_ACTION = "contact_sales"
const RECAPTCHA_PROJECT_ID = "just-sunrise-491718-m9"

async function verifyRecaptchaToken(
  token: string,
  siteKey: string
): Promise<boolean> {
  const secretKey = env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY is missing")
    return false
  }

  const assessmentUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${secretKey}`

  const response = await fetch(assessmentUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event: {
        token,
        siteKey,
        expectedAction: RECAPTCHA_EXPECTED_ACTION
      }
    })
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    console.warn(`reCAPTCHA assessment failed: ${response.status} ${body}`)
    return false
  }

  const assessment = (await response.json()) as {
    tokenProperties?: {
      valid?: boolean
      action?: string
    }
    riskAnalysis?: {
      score?: number
    }
  }

  const validToken = assessment.tokenProperties?.valid === true
  const validAction =
    assessment.tokenProperties?.action === RECAPTCHA_EXPECTED_ACTION
  const score = assessment.riskAnalysis?.score ?? 0

  return validToken && validAction && score >= RECAPTCHA_MIN_SCORE
}

export async function sendToSlack(
  args: z.infer<typeof ContactSalesSlackSchema>
) {
  const result = ContactSalesSlackSchema.safeParse(args)
  if (!result.success) {
    return { success: false }
  }

  const siteKey = env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  if (!siteKey) {
    console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing")
    return { success: false }
  }

  const recaptchaValid = await verifyRecaptchaToken(args.recaptchaToken, siteKey)
  if (!recaptchaValid) {
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
  message: string
): Promise<{ success: boolean; error?: string }> {
  const url = env.SLACK_ORDER_HOOK_URL
  if (!url) {
    return { success: false, error: "Missing SLACK_ORDER_HOOK_URL" }
  }

  try {
    new URL(url)
  } catch {
    return { success: false, error: "Invalid SLACK_ORDER_HOOK_URL" }
  }

  const payload = { text: message }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
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
