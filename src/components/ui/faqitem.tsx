import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import * as React from "react"

export function FAQItem({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <AccordionItem value={title} className="border-none">
      <AccordionTrigger className="mb-0 w-full rounded px-2 py-4 text-left font-normal transition hover:bg-slate-700 hover:no-underline">
        <h3 className="text-xl">{title}</h3>
      </AccordionTrigger>
      <AccordionContent className="mt-0 p-2 pt-0 text-base text-stone-400">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
