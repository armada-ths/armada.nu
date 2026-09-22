"use client"
import {
  EmailListSignupForm,
  type EmailListSignupFields
} from "@/app/student/recruitment/_components/shared/EmailListSignupForm"

const EVENTRO_SIGNUP_URL =
  "https://app.eventro.se/api/v1/register-email-campaign-user"

interface EmailListSignupProps {
  campaignId?: string
  title?: string
  description?: string
}

/**
 * Wires the presentational form to Eventro's public email campaign endpoint.
 * Calling Eventro from the browser preserves the request Origin and client IP,
 * which Eventro uses for its allowlist and rate limiting.
 */
export function EmailListSignup({
  campaignId = process.env.NEXT_PUBLIC_EVENTRO_RECRUITMENT_EMAIL_CAMPAIGN_ID,
  title,
  description
}: EmailListSignupProps) {
  async function handleSubmit(fields: EmailListSignupFields): Promise<boolean> {
    if (!campaignId) return false

    try {
      const response = await fetch(EVENTRO_SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ campaignId, ...fields })
      })

      return response.ok
    } catch {
      return false
    }
  }

  return (
    <EmailListSignupForm
      onSubmit={handleSubmit}
      title={title}
      description={description}
    />
  )
}
