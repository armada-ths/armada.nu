import { P } from "@/app/_components/Paragraph"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import Link from "next/link"

export async function CompanyRegistrationButton() {
  const { fr } = await fetchDates()
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
    <Link href="https://app.eventro.se/register/armada">
      <Button>Exhibitor Signup</Button>
    </Link>
  )
}
