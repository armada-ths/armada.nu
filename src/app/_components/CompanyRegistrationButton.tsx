"use client"

import { P } from "@/app/_components/Paragraph"
import { track } from "@vercel/analytics"
import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import Link from "next/link"

export function CompanyRegistrationButton({
  signupUrl,
  dates
}: {
  signupUrl: string
  dates: { fr: { end: string } }
}) {
  const signUpDate = DateTime.local(2025, 3, 3, { zone: "Europe/Stockholm" })
  const isAfterFr = DateTime.now() > DateTime.fromISO(dates.fr.end)
  const isBeforeSignUpDate = DateTime.now() < signUpDate

  if (isAfterFr) {
    return
  } else if (isBeforeSignUpDate) {
    return (
      <P>
        {DateTime.now().year} signup opens {signUpDate.monthLong}{" "}
        {signUpDate.day}
      </P>
    )
  }

  return (
    <Link href={signupUrl} onClick={() => track("exhibitor_signup_click", { location: "exhibitor_page_registration" })}>
      <Button>Exhibitor Signup</Button>
    </Link>
  )
}
