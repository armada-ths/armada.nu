import { EventsTimeline } from "@/app/student/_components/EventsTimeLine"
import { Page } from "@/components/shared/Page"
import { Suspense } from "react"

export default async function StudentEventPage() {
	return (
		<Page.Background withIndents>
			<Page.Boundary>
				<Page.Header>Events</Page.Header>
				<Suspense></Suspense>
				<EventsTimeline />
			</Page.Boundary>
		</Page.Background>
	)
}
