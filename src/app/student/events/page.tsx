import { EventsTimeline } from "@/app/student/_components/EventsTimeLine"
import { Page } from "@/components/shared/Page"
import { fetchEvents } from "@/components/shared/hooks/api/useEvents"
import { Suspense } from "react"

export default async function StudentEventPage() {
	const events = await fetchEvents()

	return (
		<Page.Background withIndents>
			<Page.Boundary>
				<Page.Header>Events</Page.Header>
				<Suspense>
					<EventsTimeline events={events} />
				</Suspense>
			</Page.Boundary>
		</Page.Background>
	)
}
