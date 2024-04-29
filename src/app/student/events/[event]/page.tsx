import EventCard from "@/app/student/events/_components/EventCard"
import { Page } from "@/components/shared/Page"
import Image from "next/image"
import { notFound } from "next/navigation"


export default async function EventsPage(props: { params: { event: string } }) {
	const id = props.params.event

	const response = await fetch("https://ais.armada.nu/api/events")
	const events = (await response.json()) as any[]

	const event = events.find(event => event.id == id)
	if (!event) return notFound()

	return (
		<Page.Background withIndents>
			<Page.Boundary>
				<Page.Header>{event.name}</Page.Header>
					<EventCard event={event}></EventCard>
			</Page.Boundary>
		</Page.Background>
	)
}
