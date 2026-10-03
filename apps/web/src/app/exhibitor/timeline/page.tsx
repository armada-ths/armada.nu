import { ExhibitorTimeline } from "@/app/exhibitor/_components/ExhibitorTimeline"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Exhibitor Timeline - Armada`,
  description:
    "From signup to fair, see what happens, step by step as an Armada exhibitor"
}

export default async function ExhibitorTimelinePage() {
  const showTimeline = await feature("EXHIBITOR_TIMELINE_PAGE")
  if (!showTimeline) {
    return <ComingSoonPage title="Exhibitor Timeline" />
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={600} className="pb-20">
        <Page.Header>Exhibitor Timeline</Page.Header>
        <p className="mt-4">
          The application is divided into 2 parts, Priority and Standard.
          Priority Registration is where you apply to exhibit at Armada, and in
          Standard Registration you choose your kit, events and other products.
          This is so we don&apos;t overfill the fair, and so we can prepare the
          best possible products for you!
        </p>
        <ExhibitorTimeline />
        <div className="h-5" />
      </Page.Boundary>
    </Page.Background>
  )
}
