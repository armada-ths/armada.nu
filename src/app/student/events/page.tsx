import { P } from "@/app/_components/Paragraph"
import { EventsTimeline } from "@/app/student/events/_components/EventsTimeLine"
import { Page } from "@/components/shared/Page"
import { Event, fetchEvents } from "@/components/shared/hooks/api/useEvents"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Events - Armada`,
  description: "All of our events leading up to the career fair."
}

function orderEvents(events: Event[], nowInSeconds: number) {
  const sorted = events.slice().sort((a, b) => a.event_start - b.event_start)

  const upcoming: Event[] = []
  const past: Event[] = []

  for (const event of sorted) {
    const relevanceTimestamp = Math.max(
      event.event_end,
      event.registration_end ?? event.event_start,
      event.event_start
    )
    if (relevanceTimestamp >= nowInSeconds) {
      upcoming.push(event)
    } else {
      past.push(event)
    }
  }

  return [...upcoming, ...past.reverse()]
}

export default async function EventPage() {
  let events: Event[] = []

  try {
    const response = await fetchEvents({
      next: {
        revalidate: 60 * 10 // every 10 minutes
      }
    })

    if (Array.isArray(response) && response.length > 0) {
      events = response
    }
  } catch (error) {
    console.error(
      `Unable to fetch events. Error: ${(error as Error)?.message || error}`
    )
  }

  const nowInSeconds = Math.floor(Date.now() / 1000)
  const orderedEvents = orderEvents(events, nowInSeconds)

  return (
    <Page.Background withIndents>
      <Page.Boundary className="items-center pb-20">
        <div className="mx-auto flex w-full max-w-[600px] flex-col items-center text-center">
          <Page.Header>Events</Page.Header>
          <P className="mt-4 max-w-2xl">
            Besides the career fair, Armada hosts a variety of events to help
            you prepare, network, and learn. Browse through our upcoming and
            past events below.
          </P>
          <div className="mx-auto flex w-full flex-col items-center pl-1 text-center">
            <EventsTimeline events={orderedEvents} />
          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
