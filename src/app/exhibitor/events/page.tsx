import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Event - Armada Exhibitor`,
  description: "The events we offer for exhibitors at Armada."
}

export default async function Packages() {
  const dates = await fetchDates()

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-[600px]">
          <Page.Header>Events</Page.Header>
          <div className="mt-4">
            <P className="max-w-[500]">
              Armada offers the opportunity for your organization to stand out
              in various events. These events are a great way to meet students
              in a more relaxed environment and to get to know them better. The
              events are a great way to advertise your organization and to get
              to know the students better.
            </P>
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-[600px]">
          <Accordion type="multiple" className="space-y-6">
            {/* Lunch Lecture */}
            <AccordionItem value="event-lunch-lecture">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`Lunch Lecture`}</span>
                  <span className="text-sm opacity-80">Location: TBD</span>
                  <span className="text-sm opacity-80">Price: 24,000/31,000 SEK</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  This is your chance to take the whole stage and showcase your
                  organization to our students. Seize the spotlight to dive into your
                  operations, company culture, or any theme of your choice to engage and
                  inspire the students. Plus, food is provided for both students and your
                  representatives!
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Panel Discussion */}
            <AccordionItem value="event-panel-discussion">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`Panel Discussion`}</span>
                  <span className="text-sm opacity-80">Location: At the fair</span>
                  <span className="text-sm opacity-80">Price: 9000 SEK</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  Join a themed panel discussion during the fair where we bring together
                  representatives from different companies to participate in a lively and
                  informative moderated discussion. This event provides an opportunity to
                  showcase your expertise, network with industry leaders and students, and
                  gain valuable insights into the latest trends and challenges facing your
                  industry.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Field Visit */}
            <AccordionItem value="event-field-visit">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`Field Visit`}</span>
                  <span className="text-sm opacity-80">Location: Your office</span>
                  <span className="text-sm opacity-80">Price: 9000 SEK</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  Welcome students to your office and show off who you are in a familiar
                  setting! This event is a unique opportunity to showcase your workplace,
                  culture, and operations firsthand while creating a memorable and engaging
                  experience for your future colleagues.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* After Work */}
            <AccordionItem value="event-after-work">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`After Work`}</span>
                  <span className="text-sm opacity-80">Location: Your Office or Nymble</span>
                  <span className="text-sm opacity-80">Price: 9000/12,000 SEK</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  Welcome students to your office to hang out, OR let us organize it for
                  you at Nymble, THS’s own pub! Choose between an informal hangout
                  fostering organic conversations and mingling or a more formal networking
                  session where you can exchange insights to forge meaningful connections
                  with the future leaders of your industry.
                </p>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
