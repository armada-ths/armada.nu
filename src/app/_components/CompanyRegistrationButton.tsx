"use client"

import type { FairDate } from "@/components/shared/hooks/api/useDates"
import { isExhibitorSignupOpen } from "@/components/shared/hooks/api/useDates"
import { Button } from "@/components/ui/button"
import { track } from "@vercel/analytics"
import Link from "next/link"

export function CompanyRegistrationButton({
  signupUrl,
  dates
}: {
  signupUrl: string
  dates: FairDate
}) {
  if (!isExhibitorSignupOpen(dates)) {
    return null
  }

  return (
    <Link href={signupUrl} onClick={() => track("exhibitor_signup_click", { location: "exhibitor_page_registration" })}>
      <Button>Exhibitor Signup</Button>
    </Link>
  )
}
