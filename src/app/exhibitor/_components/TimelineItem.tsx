import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn, formatDate } from "@/lib/utils"

export function TimelineItem({
  children,
  title,
  dateStringISO,
  dateStringHuman = formatDate(dateStringISO),
}: {
  children?: React.ReactNode
  title: string
  dateStringISO: string
  dateStringHuman?: string
}) {
  const expandable = !!children

  return (
    <AccordionItem
      value={title}
      className="relative bg-snow"
    >
      {/* TIMELINE SPINE */}
      <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-licorice" />

      {/* NODE */}
      <div className="absolute left-2.75 top-4 w-3 h-3 bg-melon-700 border border-licorice" />

      {/* HEADER (flat melon block) */}
      <AccordionTrigger
        className={cn(
          "border-l-2 ml-8 w-full text-left rounded-none",
          "border-l-2 border-licorice bg-melon-700 hover:bg-emerald-500",

          expandable
            ? "hover:bg-emerald-500 cursor-pointer"
            : "cursor-default pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-1">
          {/* DATE */}
          <span className="text-xs font-semibold px-2 py-0.5 w-fit bg-snow border border-licorice">
            {dateStringHuman}
          </span>

          {/* TITLE */}
          <h3 className="text-3xl font-bebas-neue text-licorice">
            {title}
          </h3>
        </div>
      </AccordionTrigger>

      {expandable && (
        <AccordionContent
          className="
            ml-8 my-4
            border-l-2
            pb-10
          "
        >
          {children}
        </AccordionContent>
      )}
    </AccordionItem>
  )
}
