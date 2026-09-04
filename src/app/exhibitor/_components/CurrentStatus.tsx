import { StatusModuleItem } from "@/app/exhibitor/_components/StatusModuleItem"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { createLocalePath, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import Link from "next/link"

const currentStatusText: Record<
  Locale,
  {
    openingSoonTitle: string
    openingSoonBody: string
    priorityOpenTitle: string
    priorityOpenPrefix: string
    priorityOpenLink: string
    priorityOpenSuffix: string
    registrationOverTitle: string
    registrationOverPrefix: string
    contactSales: string
    registrationOverSuffix: string
    standardOpenTitle: string
    standardOpenPrefix: string
    standardOpenLink: string
    standardOpenSuffix: string
  }
> = {
  en: {
    openingSoonTitle: "Registration is opening soon!",
    openingSoonBody:
      "We are preparing the registration for next year's Armada.",
    priorityOpenTitle: "Priority Registration open",
    priorityOpenPrefix:
      "During the Priority Registration, you can apply to become an exhibitor at Armada. By doing so, you do not commit to participating, yet you'll be eligible for a discount. Learn more about each stage",
    priorityOpenLink: "here",
    priorityOpenSuffix: ".",
    registrationOverTitle: "Registration Period is over",
    registrationOverPrefix:
      "Registration is over for now, but there might be spots left. Please",
    contactSales: "contact sales",
    registrationOverSuffix: "if you are interested!",
    standardOpenTitle: "Standard Registration is open",
    standardOpenPrefix:
      "In the Standard Registration, you choose your kit and finalize your order. Once that is done it is time to prepare the practicalities of exhibiting. All of this is done on the Armada registration dashboard. Read more about how registration works",
    standardOpenLink: "here",
    standardOpenSuffix: "if you are interested!"
  },
  sv: {
    openingSoonTitle: "Registreringen öppnar snart!",
    openingSoonBody: "Vi förbereder registreringen inför nästa års Armada.",
    priorityOpenTitle: "Prioritetsregistreringen är öppen",
    priorityOpenPrefix:
      "Under prioritetsregistreringen kan ni ansöka om att bli utställare på Armada. Ansökan innebär inte att ni förbinder er att delta, men ni blir berättigade till rabatt. Läs mer om varje steg",
    priorityOpenLink: "här",
    priorityOpenSuffix: ".",
    registrationOverTitle: "Registreringsperioden är över",
    registrationOverPrefix:
      "Registreringen är stängd för tillfället, men det kan finnas platser kvar. Vänligen",
    contactSales: "kontakta sales",
    registrationOverSuffix: "om ni är intresserade!",
    standardOpenTitle: "Standardregistreringen är öppen",
    standardOpenPrefix:
      "Under standardregistreringen väljer ni kit och slutför er beställning. När det är klart är det dags att förbereda det praktiska inför ert deltagande. Allt görs i Armadas registreringsportal. Läs mer om hur registreringen fungerar",
    standardOpenLink: "här",
    standardOpenSuffix: "om ni är intresserade!"
  }
}

//ASSUMPTION: the start date will be first for fair dates
export async function CurrentStatus() {
  const locale = await getRequestLocale()
  const dict = currentStatusText[locale]
  const withLocale = (path: string) => createLocalePath(path, locale)
  const dates = await fetchDates()
  if (!dates) return null
  const today = Date.now() //.toISOString();

  if (today < new Date(dates.ir.start).getTime()) {
    return (
      <StatusModuleItem title={dict.openingSoonTitle}>
        <p>
          {dict.openingSoonBody}
          {/*  In the
          meanwhile, you are very welcome to report interest in this{" "}
          <Link
            className="text-snow underline hover:no-underline"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdny1mhsj1Wutt_FaJtqgxKJP3OOBrWW09Ic3T5_NwEHWhV_w/viewform?usp=sf_link">
            form
          </Link>{" "}
          and we will get back to you once registration is open! */}
        </p>
      </StatusModuleItem>
    )
  } else if (
    today > new Date(dates.ir.start).getTime() &&
    today < new Date(dates.ir.end).getTime()
  ) {
    return (
      <StatusModuleItem title={dict.priorityOpenTitle}>
        <p>
          {dict.priorityOpenPrefix}
          {"\u00A0"}
          <Link
            className="whitespace-nowrap underline hover:no-underline"
            href={withLocale("/exhibitor/timeline")}>
            {dict.priorityOpenLink}
          </Link>
          {dict.priorityOpenSuffix}
        </p>
      </StatusModuleItem>
    )
  } else if (
    today > new Date(dates.ir.end).getTime() &&
    today < new Date(dates.fr.start).getTime()
  ) {
    return (
      <StatusModuleItem title={dict.registrationOverTitle}>
        <p>
          {dict.registrationOverPrefix}{" "}
          <Link
            className="text-snow underline hover:no-underline"
            href="mailto:sales@armada.nu">
            {dict.contactSales}
          </Link>{" "}
          {dict.registrationOverSuffix}
        </p>
      </StatusModuleItem>
    )
  } else if (
    today > new Date(dates.fr.start).getTime() &&
    today < new Date(dates.fr.end).getTime()
  ) {
    return (
      <StatusModuleItem title={dict.standardOpenTitle}>
        <p>
          {dict.standardOpenPrefix}
          {"\u00A0"}
          <Link
            className="text-snow whitespace-nowrap underline hover:no-underline"
            href={withLocale("/exhibitor/timeline")}>
            {dict.standardOpenLink}
          </Link>{" "}
          {dict.standardOpenSuffix}
        </p>
      </StatusModuleItem>
    )
  }

  //default
  return <div></div>
}
