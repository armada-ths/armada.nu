import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { Button } from "@/components/ui/button"
import { cn, formatTimestampAsDate, formatTimestampAsTime } from "@/lib/utils"

import { Calendar, Clock, Coins, MapPin, Utensils } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

function InfoBoxItem({
	label,
	value,
	icon
}: {
	label: string
	value: string
	icon?: ReactNode
}) {
	if (value == null) return
	return (
		<div className="flex gap-2">
			<div className="flex gap-2 text-stone-200">
				<span className="mt-1 w-5">{icon}</span>
				<span className="w-20 flex-none font-bold ">{label}:</span>
			</div>
			<span className="text-stone-400">{value}</span>
		</div>
	)
}

export default function EventDetails({
	event,
	className
}: {
	event: Event
	className?: string
}) {
	event.description =
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid rem quis enim nulla ipsa et praesentium aut autem non? Exercitationem harum tenetur incidunt in doloremque nostrum inventore veniam libero ipsa atque porro praesentium consequuntur excepturi necessitatibus, doloribus, aspernatur saepe eos quibusdam soluta dolorem ad voluptates laudantium debitis? Obcaecati autem consectetur laborum aspernatur non veniam ut tempora? Culpa sint id itaque sed rerum ipsa doloremque minima, nihil quos maiores ea laboriosam ab harum ut error eveniet quas sapiente optio iste, atque quibusdam? Ipsam numquam unde iste tempore! Aspernatur officia commodi expedita iste, dolor ad? Obcaecati quam quae dolor, fuga porro quis!"
	return (
		<div className={cn("mx-auto max-w-[600px] lg:max-w-[1000px]", className)}>
			<Page.Header>{event.name}</Page.Header>
			<div className="mt-4 flex flex-col gap-8 lg:flex-row">
				<div className="lg:w-3/5">
					{event.image_url && (
						<Image
							className="float-left mb-2 mr-5 mt-2 rounded-md"
							src={event.image_url}
							alt="" // TODO
							width={150}
							height={150}
						/>
					)}
					<P className="mt-0">{event.description}</P>
				</div>

				<div className=" mt-1 flex h-fit flex-col gap-4 rounded-md border border-emerald-900 bg-gradient-to-br from-emerald-950 to-neutral-900 to-50% p-5 lg:w-2/5 ">
					{/* Top row */}
					<InfoBoxItem
						label="Location"
						value={event.location}
						icon={<MapPin size={16} />}></InfoBoxItem>
					<InfoBoxItem
						label="Date"
						value={formatTimestampAsDate(event.event_start)}
						icon={<Calendar size={16} />}></InfoBoxItem>
					<InfoBoxItem
						label="Time"
						value={`${formatTimestampAsTime(event.event_start)} - ${formatTimestampAsTime(event.event_end)}`}
						icon={<Clock size={16} />}></InfoBoxItem>

					{/* Separator */}
					{(event.food || event.fee) && (
						<div className="h-[1px] w-full bg-stone-400"></div>
					)}

					{/* Bottom row */}
					<InfoBoxItem
						label="Food"
						value={event.food}
						icon={<Utensils size={16} />}></InfoBoxItem>
					<InfoBoxItem
						label="Fee"
						value={`${event.fee} kr`}
						icon={<Coins size={16} />}></InfoBoxItem>

					{event.open_for_signup && event.registration_end && (
						<p className="text-stone-400 mt-3 text-xs -mb-1">Registration closes {formatTimestampAsDate(event.registration_end)}</p>
					)}

					{/* Signup */}
					{event.open_for_signup ? (
						<Button>
							<Link href={event.signup_link ?? ""}>Sign Up</Link>
						</Button>
					) : (
						<Button disabled>
							Registration closed{" "}
							{event.registration_end
								? formatTimestampAsDate(event.registration_end)
								: ""}
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
