import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchTimelineEntries } from "@/components/shared/hooks/api/useTimelineEntries"
import { Page } from "@/components/shared/Page"
import type { Metadata } from "next"
import { HistoryTimeline } from "./_components/HistoryTimeline"

export const metadata: Metadata = {
  title: "The History of Armada",
  description:
    "Explore 45 years of Armada — Scandinavia's largest student-run job fair. A timeline of milestones, growth, and community."
}

export default async function TimelinePage() {
  const showTimeline = await feature("ARMADA_TIMELINE_PAGE")
  if (!showTimeline) {
    return <ComingSoonPage title="The History of Armada" />
  }

  const allEntries = (await fetchTimelineEntries()).sort(
    (a, b) => a.sortOrder - b.sortOrder
  )

  // Group by era, preserving insertion order
  const eraMap = new Map<
    string,
    { eraTitle: string; entries: typeof allEntries }
  >()
  for (const entry of allEntries) {
    if (!eraMap.has(entry.era)) {
      eraMap.set(entry.era, { eraTitle: entry.eraTitle, entries: [] })
    }
    eraMap.get(entry.era)!.entries.push(entry)
  }
  const groupedEras = Array.from(eraMap.values())

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={1440} className="pb-20">
        <Page.Header className="text-center">The History of Armada</Page.Header>
        <p className="font-lato text-licorice/70 mt-2 text-center text-base">
          A timeline over 45 years of Scandinavia&apos;s largest student-run job
          fair
        </p>
        <HistoryTimeline eras={groupedEras} />
      </Page.Boundary>
    </Page.Background>
  )
}
