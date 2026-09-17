"use client"
import { subscribeToRecruitmentEmailList } from "@/app/student/recruitment/actions"
import {
  EmailListSignupForm,
  EmailListSignupResult
} from "@/app/student/recruitment/_components/shared/EmailListSignupForm"
import Script from "next/script"
import { useEffect, useState } from "react"

const RECAPTCHA_ACTION = "recruitment_email_signup"

function isRecaptchaAllowedHostname(hostname: string) {
  return (
    hostname === "armada.nu" ||
    hostname === "staging.armada.nu" ||
    hostname.endsWith(".vercel.app") // Vercel PR preview deployments
  )
}

/**
 * Wires the presentational EmailListSignupForm up to reCAPTCHA Enterprise and
 * the subscribeToRecruitmentEmailList server action, which forwards signups
 * to Eventro's email campaign feature.
 */
export function EmailListSignup() {
  const [isAllowedHost, setIsAllowedHost] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    setIsAllowedHost(isRecaptchaAllowedHostname(window.location.hostname))
  }, [])

  const shouldLoadRecaptcha = Boolean(siteKey) && isAllowedHost

  async function handleSubmit(email: string): Promise<EmailListSignupResult> {
    if (!siteKey || !isAllowedHost) {
      return {
        success: false,
        error: "Signups aren't available on this domain right now."
      }
    }

    const grecaptchaEnterprise = window.grecaptcha?.enterprise
    if (!grecaptchaEnterprise) {
      return {
        success: false,
        error: "reCAPTCHA is not ready yet. Please try again."
      }
    }

    await new Promise<void>(resolve => {
      grecaptchaEnterprise.ready(() => resolve())
    })

    const recaptchaToken = await grecaptchaEnterprise.execute(siteKey, {
      action: RECAPTCHA_ACTION
    })

    const result = await subscribeToRecruitmentEmailList({
      email,
      recaptchaToken
    })

    if (result.success) {
      return { success: true }
    }

    return { success: false, error: "Signup failed. Please try again." }
  }

  return (
    <>
      {shouldLoadRecaptcha ? (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      ) : null}
      <EmailListSignupForm onSubmit={handleSubmit} />
    </>
  )
}
