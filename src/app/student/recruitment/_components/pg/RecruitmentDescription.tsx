import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import { type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"

const pgDescriptionText: Record<
  Locale,
  {
    heading: string
    intro: string
    areasIntro: string
    eventsHeading: string
    eventsBody: string
    premisesHeading: string
    premisesBody: string
    marketingHeading: string
    marketingBody: string
  }
> = {
  en: {
    heading: "About PG",
    intro:
      "The project group is a dynamic environment where initiative and innovation is the standard and no idea is too big. We grow like a start-up, from about 15 PG's to 200 engaged students in just 9 months. Our huge scale allows the PG to gain valuable experience handling substantial budgets and leading large organizations, giving them responsibilities they would normally only encounter many years after graduating.",
    areasIntro:
      "While there's no strict organisation of the project group, the general areas that we work with are:",
    eventsHeading: "Events, sales & banquet",
    eventsBody:
      "Armada's core focus is creating experiences that bring students and industry together. From events that spark ideas and connections, to seamless interactions between students and company representatives at the banquet, every aspect is designed to deliver a feeling of quality for our customers.",
    premisesHeading: "Premises",
    premisesBody:
      "Armada is a huge apparatus with 20 000 fair visits, two locations and a lot of logistical challenges. This requires months of planning, a robust organisation with incisive leadership and creative solutions. These elements ensure that every part of the fair runs seamlessly and has an impressive impact on visitors.",
    marketingHeading: "Marketing, recruitment & web",
    marketingBody:
      "Our fair, events and organisation needs strong marketing to reach the right students and companies, securing both engagement and lasting relationships year after year. Our marketing PG's are not just web developers, designers and content creators, they are also sharp strategists keeping Armada's goals at the center of everything they do."
  },
  sv: {
    heading: "Om projektgruppen",
    intro:
      "Projektgruppen är en dynamisk miljö där initiativ och innovation är standard och ingen idé är för stor. Vi växer som en startup, från omkring 15 personer i projektgruppen till 200 engagerade studenter på bara 9 månader. Den stora skalan gör att projektgruppen får värdefull erfarenhet av att hantera stora budgetar och leda stora organisationer, med ansvar som man ofta möter först många år efter examen.",
    areasIntro:
      "Även om projektgruppen inte är strikt uppdelad arbetar vi främst inom följande områden:",
    eventsHeading: "Event, sales och bankett",
    eventsBody:
      "Armadas kärnfokus är att skapa upplevelser som för samman studenter och näringsliv. Från event som väcker idéer och kontakter till smidiga möten mellan studenter och företagsrepresentanter på banketten är varje del utformad för att ge våra kunder en känsla av kvalitet.",
    premisesHeading: "Lokaler",
    premisesBody:
      "Armada är ett stort arrangemang med 20 000 mässbesök, två platser och många logistiska utmaningar. Det kräver månader av planering, en robust organisation med tydligt ledarskap och kreativa lösningar. Dessa delar säkerställer att varje del av mässan fungerar smidigt och gör starkt intryck på besökarna.",
    marketingHeading: "Marknadsföring, rekrytering och webb",
    marketingBody:
      "Vår mässa, våra event och vår organisation behöver stark marknadsföring för att nå rätt studenter och företag och skapa engagemang och långsiktiga relationer år efter år. Våra marknadsföringsansvariga i projektgruppen är inte bara webbutvecklare, designers och innehållsskapare, utan också skarpa strateger som håller Armadas mål i centrum."
  }
}

export async function RecruitmentDescription() {
  const locale = await getRequestLocale()
  const dict = pgDescriptionText[locale]

  return (
    <div className="my-8">
      <Page.Header className="text-4xl">{dict.heading}</Page.Header>
      <P>{dict.intro}</P>
      <P>{dict.areasIntro}</P>
      <Page.Header className="mt-6 text-2xl">{dict.eventsHeading}</Page.Header>
      <P>{dict.eventsBody}</P>
      <Page.Header className="mt-6 text-2xl">
        {dict.premisesHeading}
      </Page.Header>
      <P>{dict.premisesBody}</P>
      <Page.Header className="mt-6 text-2xl">
        {dict.marketingHeading}
      </Page.Header>
      <P>{dict.marketingBody}</P>
    </div>
  )
}
