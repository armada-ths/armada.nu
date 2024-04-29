import { P } from "@/app/_components/Paragraph"
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export function EventItem({
	children,
	title,
	dateString
}: {
	children?: React.ReactNode
	title: string
	dateString: string
}) {
	const expandable = children != null
	return (
		<AccordionItem value={title} disabled={!expandable} className="border-none">
			<div className="absolute -start-1.5 mt-3.5 h-3 w-3 rounded-full border border-white bg-melon-700"></div>
			<AccordionTrigger
				disabled={!expandable}
				className={cn(
					"mb-2 ml-4 w-full rounded px-2 pb-4 pt-0 text-left font-normal hover:no-underline",
					{ "transition hover:bg-slate-700": expandable }
				)}>
				<div>
					<P className="text-stone-400">{dateString}</P>
					<div className="flex w-full justify-between ">
						<h3 className="text-2xl md:text-3xl">{title}</h3>
					</div>
				</div>
			</AccordionTrigger>
			<AccordionContent className="-mt-2 ml-1 px-5 text-base">
				{children}
			</AccordionContent>
		</AccordionItem>
	)
}
