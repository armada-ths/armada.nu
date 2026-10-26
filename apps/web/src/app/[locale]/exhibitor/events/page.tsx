import { pageMetadata } from "@/i18n/metadata"
import { getTranslations } from "next-intl/server"
import { localeAlternates } from "@/i18n/metadata"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { Metadata } from "next"

import { ExhibitorEvents } from "./_components/ExhibitorEvents"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ExhibitorEventsMetadata")
  return pageMetadata("/exhibitor/events", {
    ...(await localeAlternates("/exhibitor/events")),
    title: t("title"),
    description: t("description")
  })
}

export default async function ExhibitorEventsPage() {
  const t = await getTranslations("ExhibitorEventsMetadata")
  const showEvents = await feature("EXHIBITOR_EVENTS")
  if (!showEvents) {
    return <ComingSoonPage title={t("title")} />
  }

  return <ExhibitorEvents />
}
