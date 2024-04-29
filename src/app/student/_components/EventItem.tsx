import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DateTime } from "luxon"

export function EventItem({
	EventTitle,
	open_for_signup,
	registration_required,
	location,
	event_start,
	registration_end,
	image_url
}: {
	id: string
	children?: React.ReactNode
	EventTitle: string
	open_for_signup: boolean
	registration_required: boolean
	location: string
	event_start: number
	registration_end: number
	image_url: string
}) {
	const expandable = false
	return (
		<Card className="border-none">
			<div className="absolute -start-1.5 mt-3.5 h-3 w-3 rounded-full border border-white bg-melon-700"></div>
			<div
				className={cn(
					"mb-2 ml-4 w-full rounded px-2 pb-4 pt-0 text-left font-normal hover:no-underline",
					{ "transition hover:bg-slate-700": expandable }
				)}>
				<div>
					<div className="flex w-full justify-between">
						<h3 className="text-2xl md:text-3xl">{EventTitle}</h3>
					</div>
					<div>{location}</div>
					<div>
						Event Start:
						{DateTime.fromMillis(event_start * 1000).toFormat("yyyy MMM dd")}
					</div>
					<div className="flex items-center">
						<div
							className={`mx-2 flex h-3 w-3 rounded-full ${open_for_signup ? "bg-green-400" : "bg-red-500"}`}></div>
						{open_for_signup ? (
							<div> Open for signup </div>
						) : (
							<div> Close for signup </div>
						)}
					</div>
					{registration_required ? (
						<div>Registration required</div>
					) : (
						<div></div>
					)}
					<div>
						Registration Due:
						{DateTime.fromMillis(registration_end * 1000).toFormat(
							"yyyy MMM dd"
						)}
					</div>
				</div>
			</div>
		</Card>
	)
}
