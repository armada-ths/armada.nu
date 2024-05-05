import { EventsTimeline } from "@/app/student/events/_components/EventsTimeLine"
import { Page } from "@/components/shared/Page"
import { fetchEvents } from "@/components/shared/hooks/api/useEvents"

export default async function StudentEventPage() {
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
