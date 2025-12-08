import { P } from "@/app/_components/Paragraph"
import { EventsTimeline } from "@/app/student/events/_components/EventsTimeLine"
import { Page } from "@/components/shared/Page"
import { Event, fetchEvents } from "@/components/shared/hooks/api/useEvents"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { eventDateTimeToEpochSeconds } from "@/lib/utils"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Events - Armada`,
  description: "All of our events leading up to the career fair."
}

function toSeconds(date: Event["eventStart"]) {
  return eventDateTimeToEpochSeconds(date) ?? Number.MAX_SAFE_INTEGER
}

function orderEvents(events: Event[], nowInSeconds: number) {
  const sorted = events
    .slice()
    .sort((a, b) => toSeconds(a.eventStart) - toSeconds(b.eventStart))

  const upcoming: Event[] = []

  for (const event of sorted) {
    const startSeconds =
      eventDateTimeToEpochSeconds(event.eventStart) ?? nowInSeconds
    const endSeconds =
      eventDateTimeToEpochSeconds(event.eventEnd) ?? startSeconds
    const registrationSeconds =
      eventDateTimeToEpochSeconds(event.registrationEnd) ?? startSeconds
    const relevanceTimestamp = Math.max(
      endSeconds,
      registrationSeconds,
      startSeconds
    )
    if (relevanceTimestamp >= nowInSeconds) {
      upcoming.push(event)
    }
  }

  return [...upcoming]
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
        <div className="w-fit mx-auto flex max-w-[600px] flex-col items-center text-center">
          <Page.Header>Events</Page.Header>
          <P className="mt-4 max-w-2xl">
            Besides the career fair, Armada hosts a variety of events to help
            you prepare, network, and learn. Browse through our upcoming events below.
          </P>
          {orderedEvents.length > 0 ? (
            <div className="mx-auto md:-ml-24 flex w-full flex-col items-center pl-1 text-center">
              <EventsTimeline events={orderedEvents} />
            </div>
          ) : (
            <div className="mx-auto flex w-full flex-col items-center pl-1 text-center">
              <Alert className="my-5">
                <AlertTitle>No events available at the moment</AlertTitle>
                <AlertDescription className="flex justify-center">
                  Follow us on{" "}
                  <Link
                    className="text-white underline hover:no-underline"
                    href={"https://www.instagram.com/thsarmada/"}>
                    instagram
                  </Link>{" "}
                  for latest news!
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
