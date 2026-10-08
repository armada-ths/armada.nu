import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"

const otFaqText: Record<
  Locale,
  {
    workQuestion: string
    workBody: string
    differenceQuestion: string
    intro: string
    leader: string
    leaderBody: string
    coordinator: string
    coordinatorBody: string
  }
> = {
  en: {
    workQuestion: "How much work is it to be part of the Operations Team?",
    workBody:
      "The time you need to spend on Armada as an OT varies between roles, but is usually 1-5 hours per week, with some roles having a more distributed workload and others requiring more time before and during the fair (17th - 18th November). Everyone in Armada is also expected to take part in the Construction Weekend before the fair (14th -15th November).",
    differenceQuestion:
      "What is the difference between a Team Leader and a Coordinator?",
    intro:
      "The Operations Team (OT) consists of two types of roles, both essential to the project but with different focuses during the fair:",
    leader: "Team Leader",
    leaderBody:
      "You lead and manage a group of hosts. In addition to your planning responsibilities, you are responsible for delegating tasks, motivating your team, and overseeing their work during the fair.",
    coordinator: "Coordinator",
    coordinatorBody:
      "You are a specialist. Your focus is on independent planning, technical execution, or data management. While you do not lead a team of hosts, you collaborate closely across the organization to ensure your specific area runs smoothly."
  },
  sv: {
    workQuestion:
      "Hur mycket arbete innebär det att vara med i Operations Team?",
    workBody:
      "Tiden du behöver lägga på Armada som OT varierar mellan roller, men är vanligtvis 1-5 timmar per vecka. Vissa roller har en mer utspridd arbetsbelastning medan andra kräver mer tid före och under mässan (17-18 november). Alla i Armada förväntas också delta under bygghelgen före mässan (14-15 november).",
    differenceQuestion:
      "Vad är skillnaden mellan en teamledare och en koordinator?",
    intro:
      "Operations Team består av två typer av roller, båda viktiga för projektet men med olika fokus under mässan:",
    leader: "Teamledare",
    leaderBody:
      "Du leder och ansvarar för en grupp värdar. Utöver planeringen ansvarar du för att delegera uppgifter, motivera teamet och följa upp deras arbete under mässan.",
    coordinator: "Koordinator",
    coordinatorBody:
      "Du är specialist. Ditt fokus ligger på självständig planering, tekniskt genomförande eller datahantering. Även om du inte leder ett värdteam samarbetar du nära med organisationen för att se till att ditt område fungerar smidigt."
  }
}

export async function FAQSection() {
  const locale = await getRequestLocale()
  const dict = otFaqText[locale]

  return (
    <div className="mx-auto mt-10 w-full max-w-187.5">
      <Page.Header className="text-licorice mb-2 text-3xl">FAQ</Page.Header>
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
