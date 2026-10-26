import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import { ExhibitorTimeline } from "@/app/[locale]/exhibitor/_components/ExhibitorTimeline"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"
import { translations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"

import { timelinePageText } from "@/i18n/dictionaries"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = timelinePageText[locale]

  return pageMetadata("/exhibitor/timeline", {
    ...(await localeAlternates("/exhibitor/timeline")),
    title: dict.title,
    description: dict.description
  })
}

export default async function ExhibitorTimelinePage() {
  const locale = await getRequestLocale()
  const dict = timelinePageText[locale]
  const showTimeline = await feature("EXHIBITOR_TIMELINE_PAGE")
  if (!showTimeline) {
    return <ComingSoonPage title={translations[locale].timeline} />
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={600} className="pb-20">
        <Page.Header>{dict.title.replace(" - Armada", "")}</Page.Header>
        <p className="mt-4">{dict.intro}</p>
        <ExhibitorTimeline />
        <div className="h-5" />
      </Page.Boundary>
    </Page.Background>
  )
}
