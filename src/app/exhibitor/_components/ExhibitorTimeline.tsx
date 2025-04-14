import { TimelineItem } from "@/app/exhibitor/_components/TimelineItem"
import { Accordion } from "@/components/ui/accordion"
import { formatDate } from "@/lib/utils"

interface TimelineItem {
  date: Date
  id: number
  title: string
  details?: string
}
export async function ExhibitorTimeline() {
  const datesNew: TimelineItem[] = [
    {
      id: 1,
      date: new Date("2025-03-03"),
      title: "Armada is setting up",
      details: `
      <p class="mt-3 text-stone-400">
        Before the Priority Registration can open, we need to make preparations. We are right now choosing a new project group — 20 something students who will work hard all year to make Armada happen.
      </p>
      <p class="mt-3 text-stone-400">
        We will open Priority Registration where you apply to be an exhibitor soon. You can express your interest here, and we will contact you as soon as registration opens!
      </p>
    `
    },
    {
      id: 2,
      date: new Date("2025-03-03"),
      title: "Priority Registration starts",
      details: `
      <p class="mt-3 text-stone-400">
        Priority Registration is where you apply to be an exhibitor. When you register you commit to be a part of Armada and if given a spot you are expected to exhibit, so wait with registration until you are sure. If you have any questions, do not hesitate to contact
        <a class="text-white underline hover:no-underline" href="mailto:sales@armada.nu">sales@armada.nu</a>.
      </p>
      <p class="mt-3 text-stone-400">
        Sadly, we can't guarantee a spot for everyone that applies. We are right now investigating how many exhibitors we can fit and how big the interest is. We try our best to get a good mix of great exhibitors that make Armada the best place for students to find their dream employer!
      </p>
      <p class="mt-3 text-stone-400">
        During the Priority Registration you don't need to choose a package, and the packages are outlined
        <a class="text-white underline hover:no-underline" href="/exhibitor/packages">here</a>
        to give you an overview. Prices are set, and small changes can occur in the larger packages.
      </p>
      <div class="my-4">
        <a href="https://app.eventro.se/register/armada" class="inline-block rounded-xl bg-white px-4 py-2 text-black font-semibold hover:bg-gray-100 transition">Signup to Armada</a>
      </div>
    `
    },
    {
      id: 3,
      date: new Date("2025-06-02"),
      title: "Priority Registration ends"
    },
    {
      id: 4,
      date: new Date("2025-08-11"),
      title: "Acceptance date",
      details: `
      <p class="mt-3 text-stone-400">
        We will get back to everyone who made a Priority Registration by August 11. This is when you will know 100% for sure that you are exhibiting at Armada. You will be informed by email and it will be visible on your exhibitor dashboard.
      </p>
      <p class="mt-3 text-stone-400">
        You can always check the status of your registration on the dashboard, and contact
        <a class="text-white underline hover:no-underline" href="mailto:sales@armada.nu">sales@armada.nu</a>
        if you have any questions.
      </p>
    `
    },
    {
      id: 5,
      date: new Date("2025-11-03"),
      title: "Standard Registration starts",
      details: `
      <p class="mt-3 text-stone-400">
        During the Standard Registration you choose your package, events, and number of banquet tickets. All of this is done on the same registration dashboard. A different person than the one who did Priority Registration can complete this.
      </p>
      <div class="my-4">
        <a href="https://app.eventro.se/register/armada" class="inline-block rounded-xl bg-white px-4 py-2 text-black font-semibold hover:bg-gray-100 transition">Signup to Armada</a>
      </div>
    `
    },
    {
      id: 6,
      date: new Date("2025-11-03"),
      title: "Standard Registration ends"
    },
    {
      id: 7,
      date: new Date("2025-11-18"),
      title: "Fair preparations start",
      details: `
      <p class="mt-3 text-stone-400">
        Once Standard Registration is complete, there are a few things that need to be sorted before the fair. Some of those are:
      </p>
      <ul class="ml-6 list-disc text-stone-400">
        <li class="mt-2">Logo and company information for the map and catalog</li>
        <li class="mt-2">Transportation of goods</li>
        <li class="mt-2">Lunch tickets and dietary restrictions</li>
      </ul>
      <p class="mt-3 text-stone-400">
        You will be assigned a Host who will guide you through everything and greet you at KTH. Hosts are assigned in early October.
      </p>
    `
    },
    {
      id: 8,
      date: new Date("2025-11-03"),
      title: "Events Weeks Start",
      details: `
      <p class="mt-3 text-stone-400">
        Before the fair, we have three weeks of events to build excitement. These offer great opportunities for students and exhibitors to meet.
      </p>
      <p class="mt-3 text-stone-400">
        The Armada Run — a 5km race — also takes place during this time.
      </p>
    `
    },
    {
      id: 9,
      date: new Date("2025-11-18"),
      title: "Armada fair starts",
      details: `
      <p class="mt-3 text-stone-400">
        The big day is here! When you arrive in the morning, your Host will show you your spot. You'll build your booth from materials already on site, then relax with some coffee in the exhibitor lounge.
      </p>
      <p class="mt-3 text-stone-400">
        At 10am, students arrive and your brand is on display. Whether they're exploring or seeking a thesis, they're eager to connect.
      </p>
      <p class="mt-3 text-stone-400">
        Best of luck — we look forward to seeing you!
      </p>
    `
    },
    {
      id: 10,
      date: new Date("2025-11-18"),
      title: "The Grand Banquet",
      details: `
      <p class="mt-3 text-stone-400">
        On the evening of the first fair day, we host the Grand Banquet — a glamorous celebration for all! Silver and Gold exhibitors have tickets included, and more can be bought during Standard Registration.
      </p>
      <p class="mt-3 text-stone-400">
        It's a fantastic opportunity to meet the brilliant students who make Armada possible in a relaxed setting.
      </p>
    `
    },
    {
      id: 11,
      date: new Date("2025-11-19"),
      title: "Armada fair ends"
    }
  ]

  const dates = {
    ir: {
      start: "2025-03-03",
      end: "2025-05-23",
      acceptance: "2025-06-02"
    },
    fr: {
      start: "2025-08-11",
      end: "2025-09-26"
    },
    events: {
      start: "2025-11-03",
      end: ""
    },
    fair: {
      days: ["2025-11-18", "2025-11-19"]
    }
  }
  function HtmlDisplay({ html }: { html: string }) {
    return (
      <div
        className="mt-3 text-stone-400"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return (
    <Accordion type="single" collapsible={true} className="relative mt-10">
      {datesNew.map((item, index) => (
        <TimelineItem
          key={item.id}
          dateStringISO={item.date.toISOString()}
          dateStringHuman={
            index === 0 ? "Before " : "" + formatDate(item.date.toISOString())
          }
          title={item.title}>
          {item.details ? <HtmlDisplay html={item.details} /> : null}
        </TimelineItem>
      ))}
    </Accordion>
  )
}
