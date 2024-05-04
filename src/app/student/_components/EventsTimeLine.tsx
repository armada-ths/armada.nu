import { EventItem } from "@/app/student/_components/EventItem"
import { Event } from "@/components/shared/hooks/api/useEvents"

export function EventsTimeline({ events }: { events: Event[] }) {
	const renderEvent = events.map(event => (
		<EventItem
			key={event.id}
			event={event}></EventItem>
	))

	return (
		<div className="relative mt-10 border-s border-melon-700">
			{renderEvent}
		</div>
	)
}
