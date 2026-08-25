import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { cn, formatDate } from "@/lib/utils"

export function TimelineList({
  children,
  className,
  defaultValue
}: {
  children: React.ReactNode
  className?: string
  defaultValue?: string
}) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn(
        "before:bg-licorice relative mt-10 space-y-5 pl-8 before:absolute before:top-8 before:bottom-8 before:left-4 before:w-0.5 before:content-[''] sm:space-y-6 sm:pl-10 sm:before:left-[1.125rem]",
        className
      )}>
      {children}
    </Accordion>
  )
}

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

  const headerClasses = cn(
    "w-full rounded-base border-2 border-licorice bg-snow p-0 text-left shadow-shadow disabled:opacity-100",
    "hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-coconut hover:shadow-[2px_2px_0_0_var(--color-licorice)]",
    "data-[state=open]:rounded-b-none data-[state=open]:bg-coconut"
  )

  return (
    <AccordionItem
      value={title}
      className="relative overflow-visible border-0 bg-transparent shadow-none">
      <div
        aria-hidden="true"
        className={cn(
          "border-licorice bg-snow absolute top-6 left-[-1.5rem] z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 shadow-[2px_2px_0_0_var(--color-licorice)] sm:left-[-2rem] sm:h-5 sm:w-5",
          expandable && "bg-melon"
        )}>
        <span className="bg-licorice h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2" />
      </div>

      <AccordionTrigger
        className={cn(
          headerClasses,
          expandable
            ? "cursor-pointer [&>svg]:mr-4"
            : "cursor-default [&>svg]:hidden"
        )}
        disabled={!expandable}>
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="rounded-base border-licorice bg-melon text-licorice w-fit shrink-0 border px-2.5 py-1 text-xs font-bold uppercase sm:order-2">
            {dateStringHuman}
          </span>

          <h3 className="font-bebas-neue text-licorice min-w-0 text-3xl leading-none break-words sm:text-4xl">
            {title}
          </h3>
        </div>
      </AccordionTrigger>

      {expandable && (
        <AccordionContent className="rounded-b-base border-licorice bg-snow text-licorice shadow-shadow border-x-2 border-b-2 px-4 pt-1 pb-6 text-base sm:px-5">
          {children}
        </AccordionContent>
      )}
    </AccordionItem>
  )
}
