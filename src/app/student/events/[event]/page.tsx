import { Page } from "@/components/shared/Page"
import Image from "next/image"

function formatDate(date: Date) {

}

export default async function EventsPage(props: { params: { event: string } }) {
	const id = props.params.event

	const response = await fetch("https://ais.armada.nu/api/events")
	const events = await response.json() as any[]

	const event = events.find(event => event.id == id)
	
	const startString = new Date(event.event_start * 1000).toLocaleDateString()
	const endString = new Date(event.event_start * 1000).toLocaleDateString()

	return (
		<Page.Background withIndents>
			<Page.Boundary>
				<Page.Header>{event.name}</Page.Header>
				<div>Description: {event.description}</div>
				<div>Location: {event.location}</div>
				<div>Start: {startString}</div>
				<div>End: {startString}</div>

				<Image src={event.image_url} alt="" width={100} height={100}/>

				<div>
					<pre>{JSON.stringify(event, null, 2)}</pre>
				</div>
			</Page.Boundary>
		</Page.Background>
	)
}
