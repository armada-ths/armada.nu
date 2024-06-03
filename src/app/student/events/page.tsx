import { EventsTimeline } from "@/app/student/events/_components/EventsTimeLine"
import { Page } from "@/components/shared/Page"
import { feature } from "@/components/shared/feature"
import { fetchEvents } from "@/components/shared/hooks/api/useEvents"
import { notFound } from "next/navigation"

export default async function StudentEventPage() {
	if (!feature("EVENT_PAGE")) {
		return notFound()
	}
	const events = await fetchEvents()

	return (
		<Page.Background withIndents>
			<Page.Boundary>
				<Page.Header>Events</Page.Header>
				<EventsTimeline events={events} />
			</Page.Boundary>
		</Page.Background>
	)
}
