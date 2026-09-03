import { P } from "@/app/_components/Paragraph"
import { EventsTimeline } from "@/app/student/events/_components/EventsTimeLine"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { Page } from "@/components/shared/Page"
import { feature } from "@/components/shared/feature"
import { Event, fetchEvents } from "@/components/shared/hooks/api/useEvents"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { translations, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { eventDateTimeToEpochSeconds } from "@/lib/utils"
import { Metadata } from "next"
import Link from "next/link"

const eventsText: Record<
  Locale,
  {
    title: string
    description: string
    intro: string
    emptyTitle: string
    emptyPrefix: string
    emptySuffix: string
  }
> = {
  en: {
    title: "Events - Armada",
    description: "All of our events leading up to the career fair.",
    intro:
      "Besides the career fair, Armada hosts a variety of events to help you prepare, network, and learn. Browse through our upcoming events below.",
    emptyTitle: "No events available at the moment",
    emptyPrefix: "Follow us on",
    emptySuffix: "for latest news!"
  },
  sv: {
    title: "Event - Armada",
    description: "Alla våra event inför arbetsmarknadsmässan.",
    intro:
      "Utöver arbetsmarknadsmässan arrangerar Armada flera event som hjälper dig att förbereda dig, nätverka och lära dig mer. Utforska våra kommande event nedan.",
    emptyTitle: "Inga event tillgängliga just nu",
    emptyPrefix: "Följ oss på",
    emptySuffix: "för de senaste nyheterna!"
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = eventsText[locale]

  return {
    title: dict.title,
    description: dict.description
  }
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
  const locale = await getRequestLocale()
  const dict = eventsText[locale]
  const showEvents = await feature("EVENT_PAGE")
  if (!showEvents) {
    return <ComingSoonPage title={translations[locale].events} />
  }

  let events: Event[] = []

  try {
    const response = await fetchEvents({
      next: {
        revalidate: 86400
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
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <Page.Header>{translations[locale].events}</Page.Header>
          <P className="mt-4 max-w-2xl">{dict.intro}</P>
          {orderedEvents.length > 0 ? (
            <div className="mt-10 w-full text-left">
              <EventsTimeline events={orderedEvents} />
            </div>
          ) : (
            <div className="mx-auto flex w-full flex-col items-center pl-1 text-center">
              <Alert className="my-5">
                <AlertTitle>{dict.emptyTitle}</AlertTitle>
                <AlertDescription className="flex justify-center">
                  {dict.emptyPrefix}{" "}
                  <Link
                    className="text-snow underline hover:no-underline"
                    href={"https://www.instagram.com/thsarmada/"}>
                    instagram
                  </Link>{" "}
                  {dict.emptySuffix}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
