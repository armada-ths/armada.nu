import { EventItem } from "@/app/student/events/_components/EventItem"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Suspense } from "react"

export function EventsTimeline({ events }: { events: Event[] }) {
  return (
    <>
      {events.length === 0 && (
        <Alert className="my-5">
          <AlertTitle>No events available at the moment</AlertTitle>
          <AlertDescription>
            Follow us on{" "}
            <Link
              className="text-white underline hover:no-underline"
              href={"https://www.instagram.com/thsarmada/"}>
              instagram
            </Link>{" "}
            for latest news!
          </AlertDescription>
        </Alert>
      )}
      <div className="relative mt-10 w-full sm:w-4/5 sm:border-s sm:border-melon-700 px-2 sm:px-0">
        {events.map(event => (
          // EventItem uses useSearchParams, so needs to have a Suspense boundary
          <Suspense key={event.id}>
            <EventItem event={event}></EventItem>
          </Suspense>
        ))}
      </div >
    </>
  )
}
