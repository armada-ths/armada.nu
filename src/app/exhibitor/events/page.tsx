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

function FAQItem({
  children,
  title,
  imageSrc,
  location,
  price
}: {
  children: React.ReactNode
  title: string
  imageSrc: string
  location: string
  price: string
}) {
  return (
    <AccordionItem value={title} className="border-none">
      <AccordionTrigger className="mb-0 w-full rounded-sm px-2 py-4 text-left font-normal transition hover:bg-slate-700 hover:no-underline">
        <h3 className="text-xl">{title}</h3>
      </AccordionTrigger>
      <AccordionContent className="mt-0 p-2 pt-0 text-base text-stone-400">
        {/*<img
          src={imageSrc}
          alt={title}
          className="mb-4 h-auto w-full rounded-sm"
        />*/}
        <p>
          <strong>Location:</strong> {location}
        </p>
        {children}
        <p>
          <strong>Price: </strong> {price}
        </p>
      </AccordionContent>
    </AccordionItem>
  )
}

export default async function Packages() {
  const dates = await fetchDates()

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-[600px]">
          <Page.Header>Events</Page.Header>
          <div className="mt-4">
            <p className="max-w-[500] text-stone-400">
              Armada offers the opportunity for your organization to stand out
              in various events. These events are a great way to meet students
              in a more relaxed environment and to get to know them better. The
              events are a great way to advertise your organization and to get
              to know the students better.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-[600px]">
          <Accordion type="multiple">
            <FAQItem
              title="Lunch Lecture"
              imageSrc=""
              location="TBD"
              price="24,000/31,000 SEK">
              <p>
                This is your chance to take the whole stage and showcase your
                organization to our students. Seize the spotlight to dive into
                your operations, company culture, or any theme of your choice to
                engage and inspire the students. Plus, food is provided for both
                students and your representatives!
              </p>
            </FAQItem>
            <FAQItem
              title="Panel Discussion"
              imageSrc=""
              location="At the fair"
              price="9000 SEK">
              <p>
                Join a themed panel discussion during the fair where we bring
                together representatives from different companies to participate
                in a lively and informative moderated discussion. This event
                provides an opportunity to showcase your expertise, network with
                industry leaders and students, and gain valuable insights into
                the latest trends and challenges facing your industry.
              </p>
            </FAQItem>
            <FAQItem
              title="Field Visit"
              imageSrc=""
              location="Your office"
              price="9000 SEK">
              <p>
                Welcome students to your office and show off who you are in a
                familiar setting! This event is a unique opportunity to showcase
                your workplace, culture, and operations firsthand while creating
                a memorable and engaging experience for your future colleagues.
              </p>
            </FAQItem>
            <FAQItem
              title="After Work"
              imageSrc=""
              location="Your Office or Nymble"
              price="9000/12,000 SEK">
              <p>
                Welcome students to your office to hang out, OR let us organize
                it for you at Nymble, THS’s own pub! Choose between an informal
                hangout fostering organic conversations and mingling or a more
                formal networking session where you can exchange insights to
                forge meaningful connections with the future leaders of your
                industry.
              </p>
            </FAQItem>
          </Accordion>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
