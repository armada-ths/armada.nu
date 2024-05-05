import { EventItem } from "@/app/student/events/_components/EventItem"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { Suspense } from "react"

export function EventsTimeline({ events }: { events: Event[] }) {
	return (
		<div className="relative mt-10 border-s border-melon-700">
			{events.map(event => (
				// EventItem uses useSearchParams, so needs to have a Suspense boundary
				<Suspense key={event.id}>
					<EventItem event={event}></EventItem>
				</Suspense>
			))}
		</div>
	)
}
