import EventDetails from "@/app/student/_components/EventDetails"
import { Page } from "@/components/shared/Page"
import { notFound } from "next/navigation"
import { fetchEvents } from "@/components/shared/hooks/api/useEvents"

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
	const id = Number.parseInt(params.id)
	const events = await fetchEvents()
	const event = events.find(event => event.id == id)
	if (event == null) return notFound()

	return (
		<Page.Background withIndents>
			<Page.Boundary>
				<EventDetails event={event}></EventDetails>
			</Page.Boundary>
		</Page.Background>
	)
}
