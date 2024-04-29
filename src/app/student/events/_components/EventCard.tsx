import { P } from "@/app/_components/Paragraph"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function EventCard({ event }: { event: any }) {
	const startString = new Date(event.event_start * 1000).toLocaleDateString()
	const endString = new Date(event.event_start * 1000).toLocaleDateString()

	return (
		<>
			<P>{event.description}</P>
			<div>Location: {event.location}</div>
			<div>Start: {startString}</div>
			<div>End: {endString}</div>
			<Button variant={"outline"}>Sign Up!</Button>

			{event.image_url && (
				<Image src={event.image_url} alt="" width={100} height={100} />
			)}
		</>
	)
}
