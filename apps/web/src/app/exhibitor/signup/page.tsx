import { BackButton } from "@/components/shared/BackButton"
import { Page } from "@/components/shared/Page"
import {
  fetchDates,
  getExhibitorSignupPhase
} from "@/components/shared/hooks/api/useDates"
import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"
import { type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"
import Link from "next/link"

const signupText: Record<
  Locale,
  {
    title: string
    description: string
    openHeading: string
    openBody: (year: number) => string
    eventroButton: string
    beforeHeading: string
    beforePrefix: (year: number) => string
    beforeContactPrefix: string
    beforeContactSuffix: string
    betweenHeading: string
    betweenPrefix: string
    betweenSuffix: string
    closedHeading: string
    closedPrefix: (year: number) => string
    closedSuffix: string
  }
> = {
  en: {
    title: "Exhibitor Signup - Armada",
    description: "Signup to exhibit at Armada",
    openHeading: "Registration is Open",
    openBody: year =>
      `Exhibitor registration for ${year} is currently open. Head over to our registration portal to secure your spot.`,
    eventroButton: "Register on Eventro",
    beforeHeading: "Registration Hasn't Opened Yet",
    beforePrefix: year =>
      `Exhibitor registration for ${year} isn't open yet. Priority Registration opens`,
    beforeContactPrefix: "Follow us on social media or reach out to",
    beforeContactSuffix: "if you'd like to get in touch in the meantime.",
    betweenHeading: "Priority Registration Has Closed",
    betweenPrefix:
      "Thank you to everyone who signed up during Priority Registration! Standard Registration opens",
    betweenSuffix:
      "Invitations will be sent out to eligible companies - stay tuned.",
    closedHeading: "Registration Has Closed",
    closedPrefix: year =>
      `Exhibitor registration for ${year} has now closed. We hope to see you at Armada ${year + 1}! In the meantime, feel free to reach out to`,
    closedSuffix: "if you have any questions."
  },
  sv: {
    title: "Utställaranmälan - Armada",
    description: "Anmäl er som utställare till Armada",
    openHeading: "Registreringen är öppen",
    openBody: year =>
      `Utställarregistreringen för ${year} är öppen. Gå till registreringsportalen för att säkra er plats.`,
    eventroButton: "Registrera på Eventro",
    beforeHeading: "Registreringen har inte öppnat ännu",
    beforePrefix: year =>
      `Utställarregistreringen för ${year} har inte öppnat ännu. Prioritetsregistreringen öppnar`,
    beforeContactPrefix: "Följ oss i sociala medier eller kontakta",
    beforeContactSuffix: "om ni vill komma i kontakt med oss under tiden.",
    betweenHeading: "Prioritetsregistreringen har stängt",
    betweenPrefix:
      "Tack till alla som anmälde sig under prioritetsregistreringen! Standardregistreringen öppnar",
    betweenSuffix: "Inbjudningar skickas till behöriga företag - håll utkik.",
    closedHeading: "Registreringen har stängt",
    closedPrefix: year =>
      `Utställarregistreringen för ${year} har nu stängt. Vi hoppas att vi ses på Armada ${year + 1}! Under tiden får ni gärna kontakta`,
    closedSuffix: "om ni har några frågor."
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = signupText[locale]

  return {
    title: dict.title,
    description: dict.description
  }
}

export default async function SignupPage() {
  const locale = await getRequestLocale()
  const dict = signupText[locale]
  const dates = await fetchDates()
  const phase = getExhibitorSignupPhase(dates)
  const year = DateTime.now().year

  let heading: string
  let body: React.ReactNode

  if (phase === "ir-open" || phase === "fr-open") {
    // Shouldn't normally be reachable — signup links redirect to Eventro when open
    heading = dict.openHeading
    body = (
      <>
        <p className="mt-4">{dict.openBody(year)}</p>
        <div className="mt-6">
          <Button asChild className="bg-grapefruit text-snow">
            <a href="https://app.eventro.se/register/armada">
              {dict.eventroButton}
            </a>
          </Button>
        </div>
      </>
    )
  } else if (phase === "before-ir") {
    heading = dict.beforeHeading
    body = (
      <p className="mt-4">
        {dict.beforePrefix(year)}{" "}
        <strong>
          {DateTime.fromISO(dates?.ir.start ?? "", {
            zone: "Europe/Stockholm"
          }).toFormat("d MMMM")}
        </strong>
        . {dict.beforeContactPrefix}{" "}
        <Link
          className="underline hover:no-underline"
          href="mailto:sales@armada.nu">
          sales@armada.nu
        </Link>{" "}
        {dict.beforeContactSuffix}
      </p>
    )
  } else if (phase === "between") {
    heading = dict.betweenHeading
    body = (
      <p className="mt-4">
        {dict.betweenPrefix}{" "}
        <strong>
          {DateTime.fromISO(dates?.fr.start ?? "", {
            zone: "Europe/Stockholm"
          }).toFormat("d MMMM")}
        </strong>
        . {dict.betweenSuffix}
      </p>
    )
  } else {
    // closed
    heading = dict.closedHeading
    body = (
      <p className="mt-4">
        {dict.closedPrefix(year)}{" "}
        <Link
          className="underline hover:no-underline"
          href="mailto:sales@armada.nu">
          sales@armada.nu
        </Link>{" "}
        {dict.closedSuffix}
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
