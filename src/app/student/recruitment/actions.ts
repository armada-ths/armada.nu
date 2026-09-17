"use server"
import { env } from "@/env"
import { z } from "zod"

const SubscribeToEmailListSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  recaptchaToken: z.string().min(1)
})

type SubscribeToEmailListResponse =
  | { success: true }
  | { success: false; error: string | Record<string, unknown> }

const RECAPTCHA_MIN_SCORE = 0.5
const RECAPTCHA_EXPECTED_ACTION = "recruitment_email_signup"

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
      invalidReason?: string
    }
    riskAnalysis?: {
      score?: number
      reasons?: string[]
    }
  }

  const validToken = assessment.tokenProperties?.valid === true
  const validAction =
    assessment.tokenProperties?.action === RECAPTCHA_EXPECTED_ACTION
  const score = assessment.riskAnalysis?.score ?? 0

  if (!validToken || !validAction || score < RECAPTCHA_MIN_SCORE) {
    console.warn(
      "reCAPTCHA assessment rejected:",
      JSON.stringify({
        validToken,
        invalidReason: assessment.tokenProperties?.invalidReason,
        expectedAction: RECAPTCHA_EXPECTED_ACTION,
        actualAction: assessment.tokenProperties?.action,
        score,
        reasons: assessment.riskAnalysis?.reasons
      })
    )
  }

  return validToken && validAction && score >= RECAPTCHA_MIN_SCORE
}

// Signs a user up to Armada's "next opening" recruitment email list in Eventro.
// Eventro owns storage/sending; we only forward the signup to their API.
export async function subscribeToRecruitmentEmailList(
  args: z.infer<typeof SubscribeToEmailListSchema>
): Promise<SubscribeToEmailListResponse> {
  const result = SubscribeToEmailListSchema.safeParse(args)
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

  const campaignId = env.EVENTRO_RECRUITMENT_EMAIL_CAMPAIGN_ID
  if (!campaignId || !env.EVENTRO_API || !env.EVENTRO_ORG) {
    console.warn("Eventro email campaign is not configured")
    return { success: false, error: "eventro_not_configured" }
  }

  try {
    const res = await fetch(
      "https://app.eventro.se/api/v1/register-email-campaign-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.EVENTRO_API}`,
          organization: env.EVENTRO_ORG
        },
        body: JSON.stringify({
          campaignId,
          email: args.email,
          name: args.name || ""
        })
      }
    )

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.warn(
        `Eventro email campaign signup failed: ${res.status} ${body}`
      )
      return { success: false, error: "eventro_signup_failed" }
    }

    return { success: true }
  } catch (e) {
    console.warn("Failed to sign up to Eventro email campaign:", e)
    return { success: false, error: "eventro_request_error" }
  }
}
