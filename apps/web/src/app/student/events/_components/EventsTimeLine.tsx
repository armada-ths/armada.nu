import { EventItem } from "@/app/student/events/_components/EventItem"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { Suspense } from "react"

import { formatTimestampAsDate } from "@/lib/utils"

export function EventsTimeline({ events }: { events: Event[] }) {
  return (
    <ol className="w-full space-y-8">
      {events.map((event, idx) => (
        <li key={event.id} className="relative">
          <time
            dateTime={String(event.eventStart)}
            className="text-licorice absolute top-8 right-[calc(50%+23.5rem)] hidden w-28 -translate-y-1/2 pr-3 text-right text-sm font-bold lg:block">
            {formatTimestampAsDate(event.eventStart)}
          </time>

          {idx > 0 && (
            <span
              className="bg-licorice absolute top-0 left-[calc(50%-22.375rem)] hidden h-8 w-1 lg:block"
              aria-hidden="true"
            />
          )}
          {idx < events.length - 1 && (
            <span
              className="bg-licorice absolute top-8 -bottom-8 left-[calc(50%-22.375rem)] hidden w-1 lg:block"
              aria-hidden="true"
            />
          )}

          <div
            className="absolute top-3 left-[calc(50%-23.5rem)] z-10 hidden size-10 items-center justify-center lg:flex"
            aria-hidden="true">
            <span className="border-licorice bg-melon size-5 rounded-full border-4" />
          </div>

          <div className="mx-auto max-w-2xl">
            {/* EventItem uses useSearchParams, so needs to have a Suspense boundary */}
            <Suspense>
              <EventItem event={event} />
            </Suspense>
          </div>
        </li>
      ))}
    </ol>
  )
}
