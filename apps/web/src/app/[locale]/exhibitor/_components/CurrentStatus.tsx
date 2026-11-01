import { StatusModuleItem } from "@/app/[locale]/exhibitor/_components/StatusModuleItem"
import { fetchDates } from "@/components/shared/hooks/api/useDates"

import { getRequestLocale } from "@/lib/i18n-server"
import { Link } from "@armada/shared/i18n/navigation"

import { currentStatusText } from "@/i18n/dictionaries"

//ASSUMPTION: the start date will be first for fair dates
export async function CurrentStatus() {
  const locale = await getRequestLocale()
  const dict = currentStatusText[locale]

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
            href={"/exhibitor/timeline"}>
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
            href={"/exhibitor/timeline"}>
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
