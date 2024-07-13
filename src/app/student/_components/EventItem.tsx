import { DateTime } from "luxon"

export function EventItem({
	id,
	title,
	event_start,
	registration_end,
	image_url
}: {
	id: string
	title: string
	event_start: number
	registration_end: number
	image_url?: string
}) {
	return (
		<div className="mb-6 ml-6 w-5/6 rounded-lg border-2 border-solid border-emerald-900 bg-gradient-to-br from-emerald-950 to-liqorice-700 hover:brightness-95 md:w-3/5">
			<a
				href="#"
				className="flex flex-auto flex-col items-center md:h-48 md:max-w-xl md:flex-row">
				<div className="absolute -start-1.5 mt-3.5 h-3 w-3 rounded-full border border-white bg-melon-700"></div>
				{image_url && (
					<img
						className="h-full w-full rounded-t-lg object-contain md:h-48 md:w-48 md:rounded-l-lg md:rounded-tr-none "
						src={image_url}
						alt=""
					/>
				)}
				<div className="flex flex-col justify-between md:pl-5">
					<h5 className="mb-4 mt-5 font-bold text-gray-900 dark:text-white md:mb-12 md:text-2xl">
						{title}
					</h5>
					<p className="mb-1 text-xs text-gray-700 dark:text-gray-400">
						Registration end:{" "}
						{DateTime.fromMillis(registration_end * 1000).toFormat(
							"yyyy MMM dd"
						)}
					</p>
					<p className="mb-4 text-xs text-gray-700 dark:text-gray-400">
						Event start:{" "}
						{DateTime.fromMillis(event_start * 1000).toFormat("yyyy MMM dd")}
					</p>
				</div>
			</a>
		</div>
	)
}
