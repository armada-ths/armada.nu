import EventDetails from "@/app/student/events/_components/EventDetails"
import { Page } from "@/components/shared/Page"
import { fetchEvents } from "@/components/shared/hooks/api/useEvents"
import { notFound } from "next/navigation"
import { Metadata } from "next"

async function getEvent(eventId: string) {
	const events = await fetchEvents()
	const event = events.find(event => event.id.toString() === eventId)
	if (event == null) return notFound()
	return event
}

export async function generateMetadata({
	params
}: {
	params: { id: string }
}): Promise<Metadata> {
	const event = await getEvent(params.id)

	return {
		title: `Armada event: ${event.name}`,
		description: event.description,
		openGraph: {
			images: [event.image_url ?? ""]
		}
	}
}

export async function generateStaticParams() {
	const events = await fetchEvents()
	return events.map(event => ({
		id: event.id.toString()
	}))
}

export default async function EventDetailsPage({
	params
}: {
	params: { id: string }
}) {
	const event = await getEvent(params.id)

	return (
		<Page.Background withIndents>
			<Page.Boundary>
				<EventDetails event={event}></EventDetails>
			</Page.Boundary>
		</Page.Background>
	)
}
