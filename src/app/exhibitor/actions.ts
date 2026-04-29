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

type SendToSlackResponse =
  | { success: true }
  | { success: false; error: string | Record<string, unknown> }

const RECAPTCHA_MIN_SCORE = 0.5
const RECAPTCHA_EXPECTED_ACTION = "contact_sales"

if (!env.RECAPTCHA_PROJECT_ID) {
  console.error("RECAPTCHA_PROJECT_ID is not configured")
}

async function verifyRecaptchaToken(
  token: string,
  siteKey: string
): Promise<boolean> {
  const secretKey = env.RECAPTCHA_SECRET_KEY
  const projectId = env.RECAPTCHA_PROJECT_ID

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY is missing")
    return false
  }
  if (!projectId) {
    console.warn("RECAPTCHA_PROJECT_ID is missing")
    return false
  }

  const assessmentUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${secretKey}`

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
): Promise<SendToSlackResponse> {
  const result = ContactSalesSlackSchema.safeParse(args)
  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten()
    }
  }

  const siteKey = env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  if (!siteKey) {
    console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing")
    return { success: false, error: "recaptcha_not_configured" }
  }

  const recaptchaValid = await verifyRecaptchaToken(
    args.recaptchaToken,
    siteKey
  )
  if (!recaptchaValid) {
    return { success: false, error: "recaptcha_validation_failed" }
  }

  const msg = {
    text: `
        # New External Contact Message #\n*Name:* ${args.name}\n*Email:* ${args.email}\n*Phone Number:* ${args.phone}\n*Company:* ${args.company}\n*Description:*\n${args.message
          .split("\n")
          .map(line => `>${line}`)
          .join("\n")}\n`
  }
  try {
    const url = env.SLACK_SALES_HOOK_URL
    if (!url) {
      console.warn("SLACK_SALES_HOOK_URL is not configured")
      return { success: false, error: "slack_not_configured" }
    }
    try {
      new URL(url)
    } catch {
      return { success: false, error: "slack_hook_url_invalid" }
    }

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(msg),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "(empty response)")
      console.warn(`Slack sales hook error: ${res.status} - ${body}`)
      return { success: false, error: "slack_delivery_failed" }
    }

    return { success: true }
  } catch (e) {
    console.warn("Failed to send message to Slack:", e)
    return { success: false, error: "slack_request_error" }
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
