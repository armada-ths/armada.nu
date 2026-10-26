"use client"
import { uiText } from "@/i18n/ui"

import { useLocale } from "@armada/shared/i18n/client"
import { normalizeLocale } from "@armada/shared/i18n/routing"

import type { FairDate } from "@/components/shared/hooks/api/useDates"
import { isExhibitorSignupOpen } from "@/components/shared/hooks/api/useDates"
import { Button } from "@/components/ui/button"

import { track } from "@vercel/analytics"
import { Link } from "@armada/shared/i18n/navigation"

export function CompanyRegistrationButton({
  signupUrl,
  dates
}: {
  signupUrl: string
  dates: FairDate
}) {
  const locale = normalizeLocale(useLocale())

  if (!isExhibitorSignupOpen(dates)) {
    return null
  }

  return (
    <Link
      href={signupUrl}
      onClick={() =>
        track("exhibitor_signup_click", {
          location: "exhibitor_page_registration"
        })
      }>
      <Button>{uiText(locale, "exhibitorSignup")}</Button>
    </Link>
  )
}
