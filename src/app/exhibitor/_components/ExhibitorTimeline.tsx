import { P } from "@/app/_components/Paragraph"
import {
  TimelineItem,
  TimelineList
} from "@/app/exhibitor/_components/TimelineItem"
import { getSignupUrl } from "@/components/shared/feature"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { Button } from "@/components/ui/button"
import { createLocalePath, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { DateTime } from "luxon"
import Link from "next/link"

const timelineText: Record<
  Locale,
  {
    before: (month: string) => string
    signupButton: string
    linkHere: string
    setupTitle: string
    setupBody: [string, string]
    priorityStartTitle: string
    priorityBody: [string, string, string]
    priorityEndTitle: string
    acceptanceTitle: string
    acceptanceBody: [string, string]
    standardStartTitle: string
    standardBody: [string, string]
    standardEndTitle: string
    preparationsTitle: string
    preparationsIntro: string
    preparationsItems: [string, string, string]
    preparationsBody: string
    eventsTitle: string
    eventsBody: [string, string]
    fairStartTitle: string
    fairStartBody: [string, string, string]
    banquetTitle: string
    banquetBody: [string, string]
    fairEndTitle: string
  }
> = {
  en: {
    before: month => `Before ${month}`,
    signupButton: "Signup to Armada",
    linkHere: "here",
    setupTitle: "Armada is setting up",
    setupBody: [
      "Before the Priority Registration can open, we need to make preparations. We are right now choosing a new project group - 20 something students who will work hard all year to make Armada happen.",
      "We will open Priority Registration where you apply to be an exhibitor soon. You can express your interest here, and we will contact you as soon as registration opens!"
    ],
    priorityStartTitle: "Priority Registration starts",
    priorityBody: [
      "Priority Registration is where you apply to be an exhibitor. When you register you commit to be a part of Armada and if given a spot you are expected to exhibit, so wait with registration until you are sure. If you have any questions, do not hesitate to contact",
      "Sadly, we can't guarantee a spot for everyone that applies. We are right now investigating how many exhibitors we can fit and how big the interest is. We try our best to get a good mix of great exhibitors that make Armada the best place for students to find their dream employer!",
      "During the Priority Registration you don't need to choose a kit, and the kits are outlined"
    ],
    priorityEndTitle: "Priority Registration ends",
    acceptanceTitle: "Acceptance date",
    acceptanceBody: [
      "We will get back to everyone who made a Priority Registration by",
      "You can always check the status of your registration on the dashboard, and contact"
    ],
    standardStartTitle: "Standard Registration starts",
    standardBody: [
      "During the Standard Registration you choose your kit, if you want to do any events, number of tickets for the banquet etc. All of this is done on the registration dashboard - same as where you did Priority Registration. Standard Registration can be done by another person than Priority Registration.",
      "We have many different products that help you reach students at KTH in different ways. If you want help finding the best kit for you, please contact"
    ],
    standardEndTitle: "Standard Registration ends",
    preparationsTitle: "Fair preparations start",
    preparationsIntro:
      "Once Standard Registration is complete, there are a few things that need to be sorted before the fair. Some of those are:",
    preparationsItems: [
      "Logo and company information for the map of exhibitors and exhibitors catalog",
      "Transportation of goods",
      "Lunch tickets and dietary restrictions"
    ],
    preparationsBody:
      "You will be assigned a Host who will help you go through these things and answer any questions you might have. The Host will also meet you when you come to KTH to show you to your spot etc. The Host will be assigned sometime in early October.",
    eventsTitle: "Events Weeks Start",
    eventsBody: [
      "Before the fair we have three weeks filled with events to build up the momentum before the fair, giving students and exhibitors the opportunity to meet in a focused environment.",
      "Armada run, the 5km race we organize with students and exhibitor representatives, is also happening during the event weeks."
    ],
    fairStartTitle: "Armada fair starts",
    fairStartBody: [
      "The days we all have waited for! For days Armada have worked together to build the fair venues and prepare everything! When you arrive in the morning, your Host meets you and shows you your spot. You'll build your booth up from the materials already in place. Then you can go to the exhibitor lounge and have a sandwich and a cup of coffee to read those few emails and charge up before the fair!",
      "At 10am the students start rolling in, and your brand will be on display. Some are looking for general career advice, some younger students just want to know who you are. Some wonder what consultants really do, and some have only one goal in mind - finding a master thesis.",
      "Best of luck and we look forward to seeing you there!"
    ],
    banquetTitle: "The Grand Banquet",
    banquetBody: [
      "On the eve of the first fair day, Armada organizes a Grand Banquet, a night of glamor, to celebrate together with you! Silver and Gold exhibitors have tickets included, and more tickets are available for purchase in Standard Registration.",
      "It is the perfect opportunity to meet the talented and ambitious students who make Armada possible in a more informal setting. Welcome!"
    ],
    fairEndTitle: "Armada fair ends"
  },
  sv: {
    before: month => `Före ${month}`,
    signupButton: "Anmäl er till Armada",
    linkHere: "här",
    setupTitle: "Armada förbereder sig",
    setupBody: [
      "Innan prioritetsregistreringen kan öppna behöver vi förbereda oss. Just nu väljer vi en ny projektgrupp - omkring 20 studenter som kommer arbeta hårt hela året för att göra Armada möjligt.",
      "Vi öppnar snart prioritetsregistreringen där ni kan ansöka om att bli utställare. Ni kan anmäla ert intresse här, så kontaktar vi er när registreringen öppnar."
    ],
    priorityStartTitle: "Prioritetsregistreringen startar",
    priorityBody: [
      "Prioritetsregistreringen är där ni ansöker om att bli utställare. När ni registrerar er förbinder ni er att delta i Armada om ni får en plats, så vänta med registreringen tills ni är säkra. Om ni har frågor, tveka inte att kontakta",
      "Tyvärr kan vi inte garantera plats för alla som ansöker. Just nu undersöker vi hur många utställare vi får plats med och hur stort intresset är. Vi gör vårt bästa för att få en bra mix av fantastiska utställare som gör Armada till den bästa platsen för studenter att hitta sin drömarbetsgivare.",
      "Under prioritetsregistreringen behöver ni inte välja kit. Kiten beskrivs"
    ],
    priorityEndTitle: "Prioritetsregistreringen slutar",
    acceptanceTitle: "Antagningsdatum",
    acceptanceBody: [
      "Vi återkommer till alla som gjort en prioritetsregistrering senast",
      "Ni kan alltid kontrollera statusen för er registrering i dashboarden och kontakta"
    ],
    standardStartTitle: "Standardregistreringen startar",
    standardBody: [
      "Under standardregistreringen väljer ni kit, event, antal bankettbiljetter och andra produkter. Allt görs i registreringsportalen, samma plats som ni använde vid prioritetsregistreringen. Standardregistreringen kan göras av en annan person än prioritetsregistreringen.",
      "Vi har många olika produkter som hjälper er att nå studenter på KTH på olika sätt. Om ni vill ha hjälp att hitta det bästa kitet för er, kontakta gärna"
    ],
    standardEndTitle: "Standardregistreringen slutar",
    preparationsTitle: "Mässförberedelserna startar",
    preparationsIntro:
      "När standardregistreringen är klar finns några saker som behöver ordnas inför mässan. Några av dem är:",
    preparationsItems: [
      "Logotyp och företagsinformation till utställarkartan och utställarkatalogen",
      "Transport av material",
      "Lunchbiljetter och kostpreferenser"
    ],
    preparationsBody:
      "Ni tilldelas en värd som hjälper er att gå igenom dessa saker och svarar på frågor. Värden möter er också när ni kommer till KTH och visar er till er plats. Värden tilldelas någon gång i början av oktober.",
    eventsTitle: "Eventveckorna startar",
    eventsBody: [
      "Inför mässan har vi tre veckor fyllda med event som bygger upp energi inför mässan och ger studenter och utställare möjlighet att mötas i en fokuserad miljö.",
      "Armada Run, loppet på 5 km som vi arrangerar med studenter och utställarrepresentanter, sker också under eventveckorna."
    ],
    fairStartTitle: "Armada-mässan startar",
    fairStartBody: [
      "Dagarna vi alla har väntat på! Armada har arbetat tillsammans för att bygga mässlokalerna och förbereda allt. När ni kommer på morgonen möter er värd er och visar er till er plats. Ni bygger upp montern med materialet som redan finns på plats. Sedan kan ni gå till Exhibitor Lounge, ta en smörgås och en kopp kaffe, läsa några mejl och ladda inför mässan.",
      "Klockan 10 börjar studenterna komma in och ert varumärke syns på plats. Vissa söker allmänna karriärråd, yngre studenter vill veta vilka ni är, andra undrar vad konsulter egentligen gör och några har ett tydligt mål: att hitta ett examensarbete.",
      "Lycka till, vi ser fram emot att träffa er där!"
    ],
    banquetTitle: "Armada Grand Banquet",
    banquetBody: [
      "Kvällen efter den första mässdagen arrangerar Armada Grand Banquet, en glamorös kväll där vi firar tillsammans med er. Silver- och guldutställare har biljetter inkluderade, och fler biljetter kan köpas under standardregistreringen.",
      "Det är ett perfekt tillfälle att träffa de talangfulla och ambitiösa studenterna som gör Armada möjligt i en mer informell miljö. Välkomna!"
    ],
    fairEndTitle: "Armada-mässan slutar"
  }
}

function formatTimelineDate(isoString: string, locale: Locale) {
  const date = DateTime.fromISO(isoString).setLocale(locale)
  if (locale === "sv") {
    return date.toFormat(
      date.year !== DateTime.now().year ? "d LLLL yyyy" : "d LLLL"
    )
  }

  return date.toFormat(
    date.year !== DateTime.now().year ? "d LLLL yyyy" : "d LLLL"
  )
}

export async function ExhibitorTimeline() {
  const locale = await getRequestLocale()
  const dict = timelineText[locale]
  const dates = await fetchDates()
  if (!dates) return null
  const signupUrl = await getSignupUrl()
  const packagesUrl = createLocalePath("/exhibitor/packages", locale)

  return (
    <TimelineList>
      <TimelineItem
        dateStringISO={dates.ir.start}
        dateStringHuman={dict.before(
          DateTime.fromISO(dates.ir.start).setLocale(locale).toFormat("LLLL")
        )}
        title={dict.setupTitle}>
        {dict.setupBody.map(body => (
          <P className="mt-3" key={body}>
            {body}
          </P>
        ))}
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.ir.start}
        dateStringHuman={formatTimelineDate(dates.ir.start, locale)}
        title={dict.priorityStartTitle}>
        <P className="mt-3">
          {dict.priorityBody[0]}{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>
          .
        </P>
        <P className="mt-3">{dict.priorityBody[1]}</P>
        <P className="mt-3">
          {dict.priorityBody[2]}{" "}
          <Link className="underline hover:no-underline" href={packagesUrl}>
            {dict.linkHere}
          </Link>
          .
        </P>
        <div className="my-4">
          <TrackedLink
            href={signupUrl}
            tracking={{
              eventName: "exhibitor_signup_click",
              eventData: {
                location: "exhibitor_timeline_priority_registration"
              }
            }}>
            <Button className="bg-grapefruit text-snow cursor-pointer">
              {dict.signupButton}
            </Button>
          </TrackedLink>
        </div>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.ir.end}
        dateStringHuman={formatTimelineDate(dates.ir.end, locale)}
        title={dict.priorityEndTitle}
      />

      <TimelineItem
        dateStringISO={dates.ir.acceptance}
        dateStringHuman={formatTimelineDate(dates.ir.acceptance, locale)}
        title={dict.acceptanceTitle}>
        <P>
          {dict.acceptanceBody[0]} {formatTimelineDate(dates.ir.end, locale)}.
        </P>
        <P>
          {dict.acceptanceBody[1]}{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>
          .
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fr.start}
        dateStringHuman={formatTimelineDate(dates.fr.start, locale)}
        title={dict.standardStartTitle}>
        <P className="mt-3">{dict.standardBody[0]}</P>
        <div className="my-4">
          <TrackedLink
            href={signupUrl}
            tracking={{
              eventName: "exhibitor_signup_click",
              eventData: {
                location: "exhibitor_timeline_standard_registration"
              }
            }}>
            <Button className="bg-grapefruit text-snow cursor-pointer">
              {dict.signupButton}
            </Button>
          </TrackedLink>
        </div>
        <P className="mt-3">
          {dict.standardBody[1]}{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>
          .
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fr.end}
        dateStringHuman={formatTimelineDate(dates.fr.end, locale)}
        title={dict.standardEndTitle}
      />

      <TimelineItem
        dateStringISO={dates.fr.end}
        dateStringHuman={formatTimelineDate(dates.fr.end, locale)}
        title={dict.preparationsTitle}>
        <P className="mt-3">{dict.preparationsIntro}</P>
        <ul className="mx-4 list-disc">
          {dict.preparationsItems.map(item => (
            <li className="mt-3" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <P className="mt-3">{dict.preparationsBody}</P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.events.start}
        dateStringHuman={formatTimelineDate(dates.events.start, locale)}
        title={dict.eventsTitle}>
        <P className="mt-3">{dict.eventsBody[0]}</P>
        <P>{dict.eventsBody[1]}</P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[0]}
        dateStringHuman={formatTimelineDate(dates.fair.days[0], locale)}
        title={dict.fairStartTitle}>
        {dict.fairStartBody.map(body => (
          <P className="mt-3" key={body}>
            {body}
          </P>
        ))}
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[0]}
        dateStringHuman={formatTimelineDate(dates.fair.days[0], locale)}
        title={dict.banquetTitle}>
        {dict.banquetBody.map(body => (
          <P className="mt-3" key={body}>
            {body}
          </P>
        ))}
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[1]}
        dateStringHuman={formatTimelineDate(dates.fair.days[1], locale)}
        title={dict.fairEndTitle}
      />
    </TimelineList>
  )
}
