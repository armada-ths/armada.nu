import { P } from "@/app/_components/Paragraph"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { Page } from "@/components/shared/Page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { DateTime } from "luxon"

export async function FAQSection() {
  const dates = await fetchDates()
  const fairDays = dates?.fair.days ?? []

  return (
    <div className="mx-auto mt-10 w-full max-w-187.5">
      <Page.Header className="text-licorice mb-2 text-3xl">FAQ</Page.Header>
      <Accordion type="single" collapsible className="space-y-6">
        <AccordionItem value="faq-1">
          <AccordionTrigger>
            How much time do I need to dedicate as a host for THS Armada?
          </AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-125">
              The actual workload varies depending on your role as a host, but
              the rough estimates would be:
            </P>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>October:</strong> 1-3 hours per week for team-building
                activities, meetings, and planning.
              </li>
              <li>
                <strong>November:</strong> 3-8 hours per week as the workload
                gradually increases to complete assigned tasks.
              </li>
              <li>
                <strong>Construction Weekend (14-15 Nov):</strong> Full-day
                availability is required for construction activities.
              </li>
              <li>
                <strong>
                  {`Fair Days (${DateTime.fromISO(fairDays[0]).toFormat("d")}-${DateTime.fromISO(fairDays[fairDays.length - 1]).toFormat("d MMM")}):`}
                </strong>{" "}
                Full-day availability is required, depending on your role.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>
            What does the recruitment process look like?
          </AccordionTrigger>
          <AccordionContent>
            <P className="mt-0">
              After you&apos;ve submitted your application, we will invite you
              to a digital interview that will take about 20 minutes. After we
              have interviewed all candidates, we will start the selection
              process and get back to you before September 22nd. If you get
              accepted, you will join the great Host Kick-off on September 27th.
            </P>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
