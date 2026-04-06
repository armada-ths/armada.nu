import { BackButton } from "@/components/shared/BackButton"
import { Page } from "@/components/shared/Page"
import { fetchDates, getExhibitorSignupPhase } from "@/components/shared/hooks/api/useDates"
import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Exhibitor Signup - Armada`,
  description: "Signup to exhibit at Armada"
}

export default async function SignupPage() {
  const dates = await fetchDates()
  const phase = getExhibitorSignupPhase(dates)
  const year = DateTime.now().year

  let heading: string
  let body: React.ReactNode

  if (phase === "ir-open" || phase === "fr-open") {
    // Shouldn't normally be reachable — signup links redirect to Eventro when open
    heading = "Registration is Open"
    body = (
      <>
        <p className="mt-4">
          Exhibitor registration for {year} is currently open. Head over to our
          registration portal to secure your spot.
        </p>
        <div className="mt-6">
          <Button asChild className="bg-grapefruit">
            <a href="https://app.eventro.se/register/armada">Register on Eventro</a>
          </Button>
        </div>
      </>
    )
  } else if (phase === "before-ir") {
    heading = "Registration Hasn't Opened Yet"
    body = (
      <p className="mt-4">
        Exhibitor registration for {year} isn't open yet. Initial Registration
        opens{" "}
        <strong>
          {DateTime.fromISO(dates.ir.start, { zone: "Europe/Stockholm" }).toFormat("d MMMM")}
        </strong>
        . Follow us on social media or reach out to{" "}
        <Link className="underline hover:no-underline" href="mailto:sales@armada.nu">
          sales@armada.nu
        </Link>{" "}
        if you'd like to get in touch in the meantime.
      </p>
    )
  } else if (phase === "between") {
    heading = "Initial Registration Has Closed"
    body = (
      <p className="mt-4">
        Thank you to everyone who signed up during Initial Registration! Final
        Registration opens{" "}
        <strong>
          {DateTime.fromISO(dates.fr.start, { zone: "Europe/Stockholm" }).toFormat("d MMMM")}
        </strong>
        . Invitations will be sent out to eligible companies — stay tuned.
      </p>
    )
  } else {
    // closed
    heading = "Registration Has Closed"
    body = (
      <p className="mt-4">
        Exhibitor registration for {year} has now closed. We hope to see you at
        Armada {year + 1}! In the meantime, feel free to reach out to{" "}
        <Link className="underline hover:no-underline" href="mailto:sales@armada.nu">
          sales@armada.nu
        </Link>{" "}
        if you have any questions.
      </p>
    )
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-150 text-center">
          <Page.Header>{heading}</Page.Header>
          {body}
          <div className="mt-6">
            <BackButton />
          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
