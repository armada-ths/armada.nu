import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { cn, formatDate } from "@/lib/utils"

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
  const expandable = !!children

  return (
    <AccordionItem value={title} className="bg-snow relative">
      {/* TIMELINE SPINE */}
      <div className="bg-licorice absolute top-4 bottom-0 left-4 w-0.5" />

      {/* NODE */}
      <div className="bg-melon-700 border-licorice absolute top-4 left-2.75 h-3 w-3 border" />

      {/* HEADER (flat melon block) */}
      <AccordionTrigger
        className={cn(
          "ml-8 w-full rounded-none border-l-2 text-left",
          "border-licorice bg-melon-700 border-l-2 hover:bg-emerald-500",

          expandable
            ? "cursor-pointer hover:bg-emerald-500"
            : "pointer-events-none cursor-default"
        )}>
        <div className="flex flex-col gap-1">
          {/* DATE */}
          <span className="bg-snow border-licorice w-fit border px-2 py-0.5 text-xs font-semibold">
            {dateStringHuman}
          </span>

          {/* TITLE */}
          <h3 className="font-bebas-neue text-licorice text-3xl">{title}</h3>
        </div>
      </AccordionTrigger>

      {expandable && (
        <AccordionContent className="my-4 ml-8 border-l-2 pb-10">
          {children}
        </AccordionContent>
      )}
    </AccordionItem>
  )
}
