import { EventItem } from "@/app/student/_components/EventItem"
import { Event } from "@/components/shared/hooks/api/useEvents"

export async function EventsTimeline({ events }: { events: Event[] }) {
	const renderEvent = events.map(event => (
		<EventItem
			key={event.id}
			id={event.id.toString()}
			title={event.name}
			event_start={event.event_start}
			registration_end={event.registration_end}
			image_url={event.image_url}></EventItem>
	))

	return (
		<div className="relative mt-10 border-s border-melon-700">
			{renderEvent}
		</div>
	)
}
