import { P } from "@/app/_components/Paragraph"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

export function TimelineItem({
  children,
  title,
  dateStringISO,
  dateStringHuman = formatDate(dateStringISO)
}: {
  children?: React.ReactNode
  title: string
  dateStringISO: string
  dateStringHuman?: string
}) {
  const expandable = children != null
  const isPastDate = new Date(dateStringISO) <= new Date()

  return (
    <AccordionItem
      value={title}
      disabled={!expandable}
      className={cn(
        "border-b-0 border-l-2 border-slate-600 pb-7 transition-[padding] duration-200 data-[state=open]:pb-3",
        { "border-melon-700": isPastDate }
      )}>
      <div
        className={cn(
          "absolute -start-1.5 size-3.5 rounded-full border border-melon-700/50 bg-slate-600",
          { "bg-melon-700": isPastDate }
        )}></div>
      <AccordionTrigger
        disabled={!expandable}
        className={cn(
          "ml-4 w-full rounded px-2 pb-1.5 text-left font-normal hover:no-underline",
          { "transition hover:text-melon-700": expandable }
        )}>
        <div>
          <P className="-mt-5 text-stone-400">{dateStringHuman}</P>
          <div className="flex w-full justify-between">
            <h3 className="text-2xl md:text-3xl">{title}</h3>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="ml-1 px-5 text-base">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
