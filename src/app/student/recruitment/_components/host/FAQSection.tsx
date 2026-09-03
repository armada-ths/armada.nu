import { P } from "@/app/_components/Paragraph"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { Page } from "@/components/shared/Page"
import { type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { DateTime } from "luxon"

const hostFaqText: Record<
  Locale,
  {
    timeQuestion: string
    timeIntro: string
    october: string
    november: string
    constructionWeekend: string
    constructionBody: string
    fairDaysBody: string
    processQuestion: string
    processBody: string
  }
> = {
  en: {
    timeQuestion:
      "How much time do I need to dedicate as a host for THS Armada?",
    timeIntro:
      "The actual workload varies depending on your role as a host, but the rough estimates would be:",
    october:
      "1-3 hours per week for team-building activities, meetings, and planning.",
    november:
      "3-8 hours per week as the workload gradually increases to complete assigned tasks.",
    constructionWeekend: "Construction Weekend",
    constructionBody:
      "Full-day availability is required for construction activities.",
    fairDaysBody: "Full-day availability is required, depending on your role.",
    processQuestion: "What does the recruitment process look like?",
    processBody:
      "After you've submitted your application, we will invite you to a digital interview that will take about 20 minutes. After we have interviewed all candidates, we will start the selection process and get back to you before September 22nd. If you get accepted, you will join the great Host Kick-off on September 27th."
  },
  sv: {
    timeQuestion: "Hur mycket tid behöver jag lägga som värd för THS Armada?",
    timeIntro:
      "Den faktiska arbetsbelastningen varierar beroende på din roll som värd, men ungefärliga uppskattningar är:",
    october: "1-3 timmar per vecka för teambuilding, möten och planering.",
    november:
      "3-8 timmar per vecka när arbetsbelastningen gradvis ökar för att slutföra tilldelade uppgifter.",
    constructionWeekend: "Bygghelgen",
    constructionBody: "Heldagstillgänglighet krävs för byggaktiviteter.",
    fairDaysBody: "Heldagstillgänglighet krävs, beroende på din roll.",
    processQuestion: "Hur ser rekryteringsprocessen ut?",
    processBody:
      "När du har skickat in din ansökan bjuder vi in dig till en digital intervju som tar ungefär 20 minuter. När vi har intervjuat alla kandidater börjar urvalsprocessen och vi återkommer före den 22 september. Om du blir antagen deltar du i Host Kick-off den 27 september."
  }
}

export async function FAQSection() {
  const locale = await getRequestLocale()
  const dict = hostFaqText[locale]
  const dates = await fetchDates()
  const fairDays = dates?.fair.days ?? []

  return (
    <div className="mx-auto mt-10 w-full max-w-187.5">
      <Page.Header className="text-licorice mb-2 text-3xl">FAQ</Page.Header>
      <Accordion type="single" collapsible className="space-y-6">
        <AccordionItem value="faq-1">
          <AccordionTrigger>{dict.timeQuestion}</AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-125">{dict.timeIntro}</P>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>{locale === "sv" ? "Oktober" : "October"}:</strong>{" "}
                {dict.october}
              </li>
              <li>
                <strong>November:</strong> {dict.november}
              </li>
              <li>
                <strong>{dict.constructionWeekend} (14-15 Nov):</strong>{" "}
                {dict.constructionBody}
              </li>
              <li>
                <strong>
                  {`Fair Days (${DateTime.fromISO(fairDays[0]).toFormat("d")}-${DateTime.fromISO(fairDays[fairDays.length - 1]).toFormat("d MMM")}):`}
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
