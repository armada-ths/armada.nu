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
		"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente beatae non omnis laborum fugiat, rerum vel aliquid cupiditate rem voluptatem doloremque odio dicta ducimus debitis est consequuntur libero voluptatibus suscipit pariatur. Delectus quisquam suscipit natus ea ducimus dignissimos ipsam molestias quos sunt. Expedita perferendis molestiae a nostrum quidem eligendi esse tempore, porro quia id itaque ullam eum nihil necessitatibus neque, illum fugiat error quae mollitia! Eius officia saepe adipisci vitae facilis! Ipsa, nisi, aspernatur illum labore laboriosam, voluptatem cum laudantium perspiciatis provident neque obcaecati! Aliquid animi vero, debitis eum quam dolorem earum commodi officia ducimus eaque perspiciatis quod illo ex!"
	return (
		<div className={cn("mx-auto max-w-[600px] lg:max-w-[1000px]", className)}>
			<Page.Header>{event.name}</Page.Header>
			<div className="mt-4 flex flex-col-reverse gap-8 lg:flex-row">
				<div className="lg:w-3/5">
					{event.image_url && (
						<Image
							className="float-left mb-2 mr-5 mt-2 rounded-md"
							src={event.image_url}
							alt="" // TODO
							width={200}
							height={200}
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
