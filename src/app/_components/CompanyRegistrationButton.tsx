import { P } from "@/app/_components/Paragraph"
import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import Link from "next/link"

export async function CompanyRegistrationButton() {
  //TODO: fix useDates to get correct dates
  //const { fr } = await fetchDates()
  const fr_end_data = "2025-11-19T17:00:00+01:00"
  const signUpDate = DateTime.local(2025, 3, 3, { zone: "Europe/Stockholm" })
  //const isAfterFr = DateTime.now() > DateTime.fromISO(fr.end)
  const isAfterFr = DateTime.now() > DateTime.fromISO(fr_end_data)
  const isBeforeSignUpDate = DateTime.now() < signUpDate

  if (isAfterFr) {
    return <P>{DateTime.now().year} signup is closed</P>
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
