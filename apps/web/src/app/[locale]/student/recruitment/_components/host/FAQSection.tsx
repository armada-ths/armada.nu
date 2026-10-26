import { uiText } from "@/i18n/ui"
import { LocalizedText } from "@/i18n/text"
import { P } from "@/app/_components/Paragraph"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { Page } from "@/components/shared/Page"

import { getRequestLocale } from "@/lib/i18n-server"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { DateTime } from "luxon"

import { hostFaqText } from "@/i18n/dictionaries"

export async function FAQSection() {
  const locale = await getRequestLocale()
  const dict = hostFaqText[locale]
  const dates = await fetchDates()
  const fairDays = dates?.fair.days ?? []

  return (
    <div className="mx-auto mt-10 w-full max-w-187.5">
      <Page.Header className="text-licorice mb-2 text-3xl">
        <LocalizedText id="fAQ" />
      </Page.Header>
      <Accordion type="single" collapsible className="space-y-6">
        <AccordionItem value="faq-1">
          <AccordionTrigger>{dict.timeQuestion}</AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-125">{dict.timeIntro}</P>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>{uiText(locale, "october")}:</strong> {dict.october}
              </li>
              <li>
                <strong>
                  <LocalizedText id="november" />
                </strong>{" "}
                {dict.november}
              </li>
              <li>
                <strong>
                  {dict.constructionWeekend} <LocalizedText id="1415Nov" />
                </strong>{" "}
                {dict.constructionBody}
              </li>
              <li>
                <strong>
                  {uiText(locale, "fairDaysLabel", {
                    dates:
                      DateTime.fromISO(fairDays[0])
                        .setLocale(locale)
                        .toFormat("d") +
                      "–" +
                      DateTime.fromISO(fairDays[fairDays.length - 1])
                        .setLocale(locale)
                        .toFormat("d MMM")
                  })}
                </strong>{" "}
                {dict.fairDaysBody}
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>{dict.processQuestion}</AccordionTrigger>
          <AccordionContent>
            <P className="mt-0">{dict.processBody}</P>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
