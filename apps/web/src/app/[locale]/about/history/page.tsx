import { pageMetadata } from "@/i18n/metadata"
import { localizedText } from "@armada/shared/i18n/routing"
import { getRequestLocale } from "@/lib/i18n-server"
import { localeAlternates } from "@/i18n/metadata"
import { LocalizedText } from "@/i18n/text"
import { getTranslations } from "@armada/shared/i18n/server"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchTimelineEntries } from "@/components/shared/hooks/api/useTimelineEntries"
import { Page } from "@/components/shared/Page"
import type { Metadata } from "next"
import { HistoryTimeline } from "./_components/HistoryTimeline"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata")
  return pageMetadata("/about/history", {
    ...(await localeAlternates("/about/history")),
    title: t("historyTitle"),
    description: t("historyDescription")
  })
}

export default async function TimelinePage() {
  const staticT = await getTranslations("Static")

  const showTimeline = await feature("ARMADA_TIMELINE_PAGE")
  if (!showTimeline) {
    return <ComingSoonPage title={staticT("theHistoryOfArmada")} />
  }

  const locale = await getRequestLocale()
  const allEntries = (await fetchTimelineEntries()).map(entry => ({
    ...entry,
    title: localizedText(locale, entry.title, entry.titleSv)!,
    body: localizedText(locale, entry.body, entry.bodySv)!,
    eraTitle: localizedText(locale, entry.eraTitle, entry.eraTitleSv)!
  }))

  // Group by era, preserving insertion order
  const eraMap = new Map<
    number,
    { eraTitle: string; entries: typeof allEntries }
  >()
  for (const entry of allEntries) {
    if (!eraMap.has(entry.eraId)) {
      eraMap.set(entry.eraId, { eraTitle: entry.eraTitle, entries: [] })
    }
    eraMap.get(entry.eraId)!.entries.push(entry)
  }
  const groupedEras = Array.from(eraMap.values())

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={1440} className="pb-20">
        <Page.Header className="text-center">
          <LocalizedText id="theHistoryOfArmada" />
        </Page.Header>
        <p className="font-lato text-licorice/70 mt-2 text-center text-base">
          <LocalizedText id="aTimelineOver45YearsOfScandinavias" />
        </p>
        <HistoryTimeline eras={groupedEras} />
      </Page.Boundary>
    </Page.Background>
  )
}
