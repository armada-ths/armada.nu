import { P } from "@/app/_components/Paragraph"
import { TimelineItem } from "@/app/exhibitor/_components/TimelineItem"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

import { SIGNUP_URL } from "@/feature_flags"
import Link from "next/link"

export async function ExhibitorTimeline() {
  const dates = await fetchDates()

  //ASSUMPTION: the start date will be first for fair dates
  return (
    <Accordion
      type="single"
      collapsible={true}
      className="relative mt-10 space-y-8">
      <TimelineItem
        dateStringISO={dates.ir.start}
        dateStringHuman={`Before ${formatDate(dates.ir.start)}`}
        title="Armada is setting up">
        <P className="mt-3">
          Before the Priority Registration can open, we need to make
          preparations. We are right now choosing a new project group - 20
          something students who will work hard all year to make Armada happen.
        </P>
        <P className="mt-3">
          We will open Priority Registration where you apply to be an exhibitor
          soon. You can express your interest here, and we will contact you as
          soon as registration opens!
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.ir.start}
        title="Priority Registration starts">
        <P className="mt-3">
          Priority Registration is where you apply to be an exhibitor. When you
          register you commit to be a part of Armada and if given a spot you are
          expected to exhibit, so wait with registration until you are sure. If
          you have any questions, do not hesitate to contact{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>
          .
        </P>
        <P className="mt-3">
          Sadly, we can&apos;t guarantee a spot for everyone that applies. We
          are right now investigating how many exhibitors we can fit and how big
          the interest is. We try our best to get a good mix of great exhibitors
          that make Armada the best place for students to find their dream
          employer!
        </P>
        <P className="mt-3">
          During the Priority Registration you don&apos;t need to choose a
          package, and the packages are outlined{" "}
          <Link
            className="underline hover:no-underline"
            href="/exhibitor/packages">
            here
          </Link>{" "}
          to give you an overview. Prices are set, and small changes can occur
          in the larger packages.
        </P>
        <div className="my-4">
          <Link href={SIGNUP_URL}>
            <Button className="bg-grape-700">Signup to Armada</Button>
          </Link>
        </div>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.ir.end}
        title="Priority Registration ends"></TimelineItem>

      <TimelineItem dateStringISO={dates.ir.acceptance} title="Acceptance date">
        <P className="">
          We will get back to everyone who made an Priority Registration by{" "}
          {formatDate(dates.ir.end)}. This is when you will know 100% for sure
          that you are exhibiting at Armada. You will be informed by email to
          the person who made the Standard Registration, and it will be visible
          on the dashboard for anyone with a login to your exhibitor&apos;s
          page.
        </P>
        <P className="">
          You can always check the status of your registration on the dashboard,
          and contact{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>{" "}
          if you have any questions.
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fr.start}
        title="Standard Registration starts">
        <P className="mt-3">
          During the Standard Registration you choose your package, if you want
          to do any events, number of tickets for the banquet etc. All of this
          is done on the registration dashboard - same as where you did Priority
          Registration. Standard Registration can be done by another person than
          Priority Registration.
        </P>
        <div className="my-4">
          <Button>
            <Link href={SIGNUP_URL}>
              Signup to Armada
            </Link>
          </Button>
        </div>
        <P className="mt-3">
          We have many different products that help you reach students at KTH in
          different ways. If you want help finding the best package for you,
          please contact{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>{" "}
          or your sales representative and they&apos;ll guide you through it.
          Maybe you want to talk to a few students in a more cozy setting? Or
          get more exposure at the fair? We can help you do that.
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fr.end}
        title="Standard Registration ends"></TimelineItem>

      <TimelineItem
        dateStringISO={dates.fr.end}
        title="Fair preparations start">
        <P className="mt-3">
          Once Standard Registration is complete, there are a few things that
          need to be sorted before the fair. Some of those are:
        </P>
        <ul className="mx-4 list-disc">
          <li className="mt-3">
            Logo and company information for the map of exhibitors and
            exhibitors catalog
          </li>
          <li className="mt-3">Transportation of goods</li>
          <li className="mt-3">Lunch tickets and dietary restrictions</li>
        </ul>
        <P className="mt-3">
          You will be assigned a Host who will help you go through these things
          and answer any questions you might have. The Host will also meet you
          when you come to KTH to show you to your spot etc. The Host will be
          assigned sometime in early October.
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.events.start}
        title="Events Weeks Start">
        <P className="mt-3">
          Before the fair we have three weeks filled with events to build up the
          momentum before the fair, giving students and exhibitors the
          opportunity to meet in a focused environment.
        </P>
        <P>
          Armada run, the 5km race we organize with students and exhibitor
          representatives, is also happening during the event weeks.
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[0]}
        title="Armada fair starts">
        <P className="mt-3">
          The days we all have waited for! For days Armada have worked together
          to build the fair venues and prepare everything! When you arrive in
          the morning, your Host meets you and shows you your spot. You&apos;ll
          build your booth up from the materials already in place. Then you can
          go to the exhibitor lounge and have a sandwich and a cup of coffee to
          read those few emails and charge up before the fair!
        </P>
        <P className="mt-3">
          At 10am the students start rolling in, and your brand will be on
          display. Some are looking for general career advice, some younger
          students just want to know who you are. Some wonder what consultants
          really do, and some have only one goal in mind - finding a master
          thesis.
        </P>
        <P className="mt-3">
          Best of luck and we look forward to seeing you there!
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[0]}
        title="The Grand Banquet">
        <P className="mt-3">
          On the eve of the first fair day, Armada organizes a Grand Banquet, a
          night of glamor, to celebrate together with you! Silver and Gold
          exhibitors have tickets included, and more tickets are available for
          purchase in Standard Registration.
        </P>
        <P className="mt-3">
          It is the perfect opportunity to meet the talented and ambitious
          students who make Armada possible in a more informal setting. Welcome!
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[1]}
        title="Armada fair ends"></TimelineItem>
    </Accordion>
  )
}
