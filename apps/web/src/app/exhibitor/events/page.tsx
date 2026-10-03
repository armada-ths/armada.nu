import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { Metadata } from "next"

import { ExhibitorEvents } from "./_components/ExhibitorEvents"

export const metadata: Metadata = {
  title: `Exhibitor Events - Armada`,
  description: "The events we offer for exhibitors at Armada."
}

export default async function ExhibitorEventsPage() {
  const showEvents = await feature("EXHIBITOR_EVENTS")
  if (!showEvents) {
    return <ComingSoonPage title="Events" />
  }

  return <ExhibitorEvents />
}
