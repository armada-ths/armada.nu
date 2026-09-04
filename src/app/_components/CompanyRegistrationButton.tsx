"use client"

import type { FairDate } from "@/components/shared/hooks/api/useDates"
import { isExhibitorSignupOpen } from "@/components/shared/hooks/api/useDates"
import { Button } from "@/components/ui/button"
import { getLocaleFromPathname } from "@/lib/i18n"
import { track } from "@vercel/analytics"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function CompanyRegistrationButton({
  signupUrl,
  dates
}: {
  signupUrl: string
  dates: FairDate
}) {
  const locale = getLocaleFromPathname(usePathname())

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
      <Button>
        {locale === "sv" ? "Anmälan för utställare" : "Exhibitor Signup"}
      </Button>
    </Link>
  )
}
