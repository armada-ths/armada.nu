import { P } from "@/app/_components/Paragraph"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { Page } from "@/components/shared/Page"
import { feature } from "@/components/shared/feature"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Exhibitor Events - Armada`,
  description: "The events we offer for exhibitors at Armada."
}

export default async function ExhibitorEventsPage() {
  const showEvents = await feature("EXHIBITOR_EVENTS")
  if (!showEvents) {
    return <ComingSoonPage title="Events" />
  }


  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto w-full max-w-150">
          <Page.Header>Exhibitor Events</Page.Header>
          <p className="text-melon mt-1 text-lg font-medium">
            Make the Most of Your Presence at Armada
          </p>
          <div className="mt-4">
            <P className="max-w-125">
              Going beyond the booth is where real talent connections are made.
              These events give you dedicated time and space to showcase your
              brand, culture, and people to KTH&apos;s most driven students, on
              your terms. Pick a format, or build your own.
            </P>
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-150">
          <Accordion type="multiple" className="space-y-6">
            {/* Lunch Lecture */}
            <AccordionItem value="event-lunch-lecture">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`Lunch Lecture`}</span>
                  <span className="text-sm opacity-80">
                    Price: 24,700 / 31,900 SEK excl. VAT
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  Own the room. Present your company, your culture, or a topic
                  you&apos;re passionate about — while students enjoy a free
                  lunch courtesy of you. It&apos;s a captive, curious audience
                  in a relaxed setting, and one of the most effective ways to
                  leave a lasting impression.
                </p>
                <p className="mt-2">
                  Food is included for both students and your representatives.
                </p>
                <ul className="mt-2 ml-4 list-disc text-sm">
                  <li>60 attendees: 24,700 SEK</li>
                  <li>100 attendees: 31,900 SEK</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Panel Discussion */}
            <AccordionItem value="event-panel-discussion">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`Panel Discussion`}</span>
                  <span className="text-sm opacity-80">
                    Price: 9,300 SEK excl. VAT
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  Position your company as a thought leader. Join a moderated,
                  themed panel alongside representatives from other leading
                  companies and engage students in an honest, dynamic
                  conversation about industry trends, challenges, and careers.
                  Great for brand credibility and visibility — and you might
                  learn something too.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Field Visit */}
            <AccordionItem value="event-field-visit">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`Field Visit`}</span>
                  <span className="text-sm opacity-80">
                    Location: Your office
                  </span>
                  <span className="text-sm opacity-80">
                    Price: 9,300 SEK / 30 attendees excl. VAT
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  Bring students into your world. Hosting a visit at your office
                  is one of the most authentic ways to communicate who you are
                  as an employer — your space, your team, your energy. Students
                  get a real feel for what working with you looks like, and you
                  get face time with motivated candidates in a setting where
                  you&apos;re at your best.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* After Work */}
            <AccordionItem value="event-after-work">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`After Work`}</span>
                  <span className="text-sm opacity-80">
                    Location: Your office or Nymble
                  </span>
                  <span className="text-sm opacity-80">
                    Price: 9,300 / 12,400 SEK excl. VAT
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  Keep the conversation going after the fair floor closes. Host
                  students for an informal mixer — at your own office for a more
                  personal touch, or let us set it up for you at Nymble,
                  THS&apos;s own pub. Whether you prefer casual mingling or
                  structured networking, this is a low-pressure environment
                  where real connections happen.
                </p>
                <ul className="mt-2 ml-4 list-disc text-sm">
                  <li>At Nymble: 12,400 SEK</li>
                  <li>At your office: 9,300 SEK</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Collaborative Events */}
            <AccordionItem value="event-collaborative">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">{`Collaborative Events`}</span>
                  <span className="text-sm opacity-80">
                    Your concept, your way
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>
                  Have something more specific in mind? Design your own event —
                  a workshop, live demo, hackathon, case competition, or
                  anything else that reflects your brand. You bring the concept
                  and the people; we handle the logistics and can arrange
                  catering if needed.
                </p>
                <p className="mt-2 text-sm">
                  Contact our events team for a quotation:{" "}
                  <Link
                    className="underline hover:no-underline"
                    href="mailto:event@armada.nu">
                    event@armada.nu
                  </Link>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
