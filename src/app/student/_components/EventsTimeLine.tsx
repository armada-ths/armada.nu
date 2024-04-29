import { EventItem } from "@/app/student/_components/EventItem"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { Accordion } from "@/components/ui/accordion"

export async function EventsTimeline({ events }: { events: Event[] }) {
	const renderEvent = events.map(event => (
		<EventItem
			key={event.id}
			id={event.id.toString()}
			EventTitle={event.name}
			open_for_signup={event.open_for_signup}
			registration_required={event.registration_required}
			location={event.location}
			event_start={event.event_start}
			registration_end={event.registration_end}
			image_url={event.image_url}></EventItem>
	))

	//ASSUMPTION: the start date will be first for fair dates
	return (
		<Accordion
			type="single"
			collapsible={true}
			className="relative mt-10 border-s border-melon-700">
			{renderEvent}
		</Accordion>
	)
}
