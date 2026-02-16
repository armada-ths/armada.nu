import { P } from "@/app/(frontend)/_components/Paragraph"
import { getSignupUrl } from "@/components/shared/feature"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import Link from "next/link"

export async function CompanyRegistrationButton() {
  const { fr } = await fetchDates()
  const signupUrl = await getSignupUrl()
  const signUpDate = DateTime.local(2025, 3, 3, { zone: "Europe/Stockholm" })
  const isAfterFr = DateTime.now() > DateTime.fromISO(fr.end)
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
    <Link href={signupUrl}>
      <Button>Exhibitor Signup</Button>
    </Link>
  )
}
