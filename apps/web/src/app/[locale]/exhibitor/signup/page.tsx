import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import { BackButton } from "@/components/shared/BackButton"
import { Page } from "@/components/shared/Page"
import {
  fetchDates,
  getExhibitorSignupPhase
} from "@/components/shared/hooks/api/useDates"
import { Button } from "@/components/ui/button"
import { DateTime } from "luxon"

import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"
import { Link } from "@armada/shared/i18n/navigation"

import { signupText } from "@/i18n/dictionaries"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = signupText[locale]

  return pageMetadata("/exhibitor/signup", {
    ...(await localeAlternates("/exhibitor/signup")),
    title: dict.title,
    description: dict.description
  })
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
