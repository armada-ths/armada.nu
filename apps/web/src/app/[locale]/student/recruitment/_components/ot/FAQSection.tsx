import { LocalizedText } from "@/i18n/text"
import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

import { getRequestLocale } from "@/lib/i18n-server"

import { otFaqText } from "@/i18n/dictionaries"

export async function FAQSection() {
  const locale = await getRequestLocale()
  const dict = otFaqText[locale]

  return (
    <div className="mx-auto mt-10 w-full max-w-187.5">
      <Page.Header className="text-licorice mb-2 text-3xl">
        <LocalizedText id="fAQ" />
      </Page.Header>
      <Accordion type="single" collapsible className="space-y-6">
        <AccordionItem value="faq-1">
          <AccordionTrigger>{dict.workQuestion}</AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-125">{dict.workBody}</P>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>{dict.differenceQuestion}</AccordionTrigger>
          <AccordionContent>
            <P className="mt-0">{dict.intro}</P>
            <P className="mt-4">
              <strong>{dict.leader}:</strong> {dict.leaderBody}
            </P>
            <P className="mt-4">
              <strong>{dict.coordinator}:</strong> {dict.coordinatorBody}
            </P>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
