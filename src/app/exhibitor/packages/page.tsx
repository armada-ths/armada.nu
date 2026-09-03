import { StatusModuleItem } from "@/app/exhibitor/_components/StatusModuleItem"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { Page } from "@/components/shared/Page"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { feature, getSignupUrl } from "@/components/shared/feature"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createLocalePath, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"
import Link from "next/link"

const packagesPageTranslations: Record<
  Locale,
  {
    metadataTitle: string
    metadataDescription: string
    comingSoonTitle: string
    heading: string
    intro: string
    didYouKnowTitle: string
    didYouKnowBody: string
    standardRegistrationPrice: string
    bronzeItems: string[]
    silverItems: string[]
    goldItems: string[]
    goldEventDetails: string
    customKitHeading: string
    customKitIntro: string
    customKitItems: { title: string; body: string }[]
    customKitContactPrefix: string
    customKitContactSuffix: string
    focusRoomsHeading: string
    focusRoomsIntro: string
    focusRoomItems: { title: string; body: string }[]
    faqHeading: string
    priorityQuestion: string
    priorityAnswerPrefix: string
    priorityAnswerSuffix: string
    registrationQuestion: string
    priorityRegistrationAnswer: string
    standardRegistrationAnswer: string
    firstSignupAnswer: string
    timelinePrefix: string
    timelineLink: string
    timelineSuffix: string
    signupQuestion: string
    signupIntro: string
    signupButton: string
    signupContactPrefix: string
  }
> = {
  en: {
    metadataTitle: "Exhibitor Kits - Armada",
    metadataDescription:
      "The kits we offer for exhibitors at Armada. Choose between bronze, silver and gold.",
    comingSoonTitle: "Kits",
    heading: "Exhibitor Kits",
    intro:
      "THS Armada strives to provide the best experience for all exhibitors through our exhibitor kits. The Bronze kit covers the basics, Silver expands your presence, and Gold makes you truly stand out with extra marketing and a dedicated event.",
    didYouKnowTitle: "Did you know?",
    didYouKnowBody:
      "When we asked the students after the fair which exhibitors they remembered, Gold exhibitors were 3 times as likely to be remembered compared to Bronze exhibitors!",
    standardRegistrationPrice: "Standard registration price:",
    bronzeItems: [
      "2x3 sqm, carpeted exhibitor space",
      "Lunch for 4 representatives",
      "700 W of Electricity",
      "Host service",
      "Access to WiFi",
      "Wardrobe & access to lounge"
    ],
    silverItems: [
      "2x4 sqm, carpeted exhibitor space",
      "Second priority placement",
      "Lunch for 6 representatives",
      "2 Armada Run Tickets",
      "2 Banquet tickets",
      "Silver partner marketing on Armada platforms",
      "1200 W of Electricity",
      "Host service",
      "Access to WiFi",
      "Wardrobe & access to lounge"
    ],
    goldItems: [
      "2x5 sqm, carpeted exhibitor space",
      "First priority placement",
      "Lunch for 8 representatives",
      "4 Armada Run tickets",
      "4 Banquet tickets",
      "One event of your choosing",
      "Customized email marketing to students",
      "Gold partner marketing on Armada platforms",
      "2300 W of Electricity",
      "Host service",
      "Access to WiFi",
      "Wardrobe & access to lounge"
    ],
    goldEventDetails: "Field visit, after work, or panel discussion",
    customKitHeading: "Custom Kit",
    customKitIntro:
      "Is a standard exhibitor kit missing something? We have you covered with additional options that may be tailored to your needs!",
    customKitItems: [
      {
        title: "Additional exhibitor space",
        body: "options to increase in both width and height are available for purchase"
      },
      {
        title: "Additional electricity",
        body: "need more power? We can provide"
      },
      {
        title: "Social media ad",
        body: "advertise your company's latest project, vacancies, or future plans through our social media platforms"
      }
    ],
    customKitContactPrefix: "Contact",
    customKitContactSuffix: "for custom options and pricing.",
    focusRoomsHeading: "Focus Rooms",
    focusRoomsIntro:
      "To showcase our commitment to our core values Sustainability and Diversity, we've created Focus Rooms during the fair for the companies that share our values. These rooms receive extra marketing attention and are highlighted during the fair.",
    focusRoomItems: [
      {
        title: "Green Room",
        body: "A place in the Green Room will highlight your sustainability work, a topic that becomes more and more important for students when looking for their future employer."
      },
      {
        title: "Diversity Room",
        body: "A place in the Diversity Room will spotlight your diversity initiatives, resonating with students seeking inclusive workplaces and enhancing your visibility during the fair."
      }
    ],
    faqHeading: "FAQ",
    priorityQuestion: 'What does "priority placement" mean?',
    priorityAnswerPrefix:
      "Priority placement means that we will place you in spots on the fair where there is good footfall. Gold exhibitors take the best spots and silver exhibitors are prioritized next. Contact",
    priorityAnswerSuffix: "for more information.",
    registrationQuestion:
      "What is the difference between Priority Registration and Standard Registration?",
    priorityRegistrationAnswer:
      "Priority Registration is where you apply to be an exhibitor. You do not need to choose a kit yet.",
    standardRegistrationAnswer:
      "Standard Registration is when you choose your kit, events, banquet tickets, and other products in the registration dashboard.",
    firstSignupAnswer:
      "You can also choose to wait and sign up for the first time during Standard Registration instead. If you do, you pay the Standard Registration price rather than the lower Priority Registration price.",
    timelinePrefix: "See our",
    timelineLink: "timeline",
    timelineSuffix: "for more details and important dates.",
    signupQuestion: "How do I sign up for Armada?",
    signupIntro: "You can sign up here:",
    signupButton: "Signup to Armada",
    signupContactPrefix: "If you have any questions, you can contact us at"
  },
  sv: {
    metadataTitle: "Utställarkit - Armada",
    metadataDescription:
      "De kit vi erbjuder utställare på Armada. Välj mellan brons, silver och guld.",
    comingSoonTitle: "Kit",
    heading: "Utställarkit",
    intro:
      "THS Armada strävar efter att ge alla utställare bästa möjliga upplevelse genom våra utställarkit. Brons täcker grunderna, Silver breddar er närvaro och Guld gör att ni verkligen syns med extra marknadsföring och ett eget event.",
    didYouKnowTitle: "Visste du?",
    didYouKnowBody:
      "När vi frågade studenterna efter mässan vilka utställare de kom ihåg var guldsponsorer 3 gånger så sannolika att bli ihågkomna jämfört med bronsutställare!",
    standardRegistrationPrice: "Pris vid standardregistrering:",
    bronzeItems: [
      "2x3 kvm mässyta med matta",
      "Lunch för 4 representanter",
      "700 W el",
      "Värdservice",
      "Tillgång till WiFi",
      "Garderob och tillgång till lounge"
    ],
    silverItems: [
      "2x4 kvm mässyta med matta",
      "Andra prioritet vid placering",
      "Lunch för 6 representanter",
      "2 biljetter till Armada Run",
      "2 bankettbiljetter",
      "Marknadsföring som silverpartner på Armadas plattformar",
      "1200 W el",
      "Värdservice",
      "Tillgång till WiFi",
      "Garderob och tillgång till lounge"
    ],
    goldItems: [
      "2x5 kvm mässyta med matta",
      "Första prioritet vid placering",
      "Lunch för 8 representanter",
      "4 biljetter till Armada Run",
      "4 bankettbiljetter",
      "Ett valfritt event",
      "Anpassad e-postmarknadsföring till studenter",
      "Marknadsföring som guldpartner på Armadas plattformar",
      "2300 W el",
      "Värdservice",
      "Tillgång till WiFi",
      "Garderob och tillgång till lounge"
    ],
    goldEventDetails: "Företagsbesök, after work eller panelsamtal",
    customKitHeading: "Anpassat kit",
    customKitIntro:
      "Saknar ett standardkit något? Vi hjälper er med tillval som kan anpassas efter era behov!",
    customKitItems: [
      {
        title: "Extra mässyta",
        body: "möjlighet att köpa till mer yta både på bredden och höjden"
      },
      {
        title: "Extra el",
        body: "behöver ni mer ström? Vi kan ordna det"
      },
      {
        title: "Annons i sociala medier",
        body: "annonsera ert företags senaste projekt, lediga tjänster eller framtidsplaner via våra sociala medier"
      }
    ],
    customKitContactPrefix: "Kontakta",
    customKitContactSuffix: "för anpassade alternativ och priser.",
    focusRoomsHeading: "Focus Rooms",
    focusRoomsIntro:
      "För att visa vårt engagemang för våra kärnvärden hållbarhet och mångfald har vi skapat Focus Rooms under mässan för företag som delar våra värderingar. Dessa rum får extra marknadsföring och lyfts fram under mässan.",
    focusRoomItems: [
      {
        title: "Green Room",
        body: "En plats i Green Room lyfter fram ert hållbarhetsarbete, ett område som blir allt viktigare för studenter när de söker sin framtida arbetsgivare."
      },
      {
        title: "Diversity Room",
        body: "En plats i Diversity Room lyfter fram era mångfaldsinitiativ, når studenter som söker inkluderande arbetsplatser och stärker er synlighet under mässan."
      }
    ],
    faqHeading: "FAQ",
    priorityQuestion: 'Vad betyder "prioriterad placering"?',
    priorityAnswerPrefix:
      "Prioriterad placering innebär att vi placerar er på platser på mässan med bra flöde av besökare. Guldutställare får de bästa platserna och silverutställare prioriteras därefter. Kontakta",
    priorityAnswerSuffix: "för mer information.",
    registrationQuestion:
      "Vad är skillnaden mellan prioritetsregistrering och standardregistrering?",
    priorityRegistrationAnswer:
      "Prioritetsregistrering är när ni ansöker om att bli utställare. Ni behöver inte välja kit ännu.",
    standardRegistrationAnswer:
      "Standardregistrering är när ni väljer kit, event, bankettbiljetter och andra produkter i registreringsportalen.",
    firstSignupAnswer:
      "Ni kan också välja att vänta och anmäla er för första gången under standardregistreringen. Då betalar ni standardpriset i stället för det lägre priset vid prioritetsregistrering.",
    timelinePrefix: "Se vår",
    timelineLink: "tidslinje",
    timelineSuffix: "för mer information och viktiga datum.",
    signupQuestion: "Hur anmäler jag mig till Armada?",
    signupIntro: "Ni kan anmäla er här:",
    signupButton: "Anmäl er till Armada",
    signupContactPrefix: "Om ni har frågor kan ni kontakta oss på"
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = packagesPageTranslations[locale]

  return {
    title: dict.metadataTitle,
    description: dict.metadataDescription
  }
}

export default async function ExhibitorPackagesPage() {
  const locale = await getRequestLocale()
  const dict = packagesPageTranslations[locale]
  const withLocale = (path: string) => createLocalePath(path, locale)
  const showPackages = await feature("EXHIBITOR_PACKAGES")
  if (!showPackages) {
    return <ComingSoonPage title={dict.comingSoonTitle} />
  }
  const signupUrl = await getSignupUrl()

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-150">
          <Page.Header>{dict.heading}</Page.Header>
          <div className="mt-4">
            <p className="max-w-125">{dict.intro}</p>
          </div>
          <StatusModuleItem title={dict.didYouKnowTitle}>
            <p>{dict.didYouKnowBody}</p>
          </StatusModuleItem>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="mt-2 flex flex-col-reverse justify-stretch gap-10 md:flex-row">
            <Card className="bg-bronze relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-2xl">Bronze</h3>
              <ul className="font-lato mt-2">
                {dict.bronzeItems.map((item, index) => (
                  <li
                    className={index < 3 ? "my-2 font-extrabold" : "my-2"}
                    key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-4">
                {/* <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p className="font-bold">45 000 SEK</p> */}
                <p className="text-sm font-bold">
                  {dict.standardRegistrationPrice}
                </p>
                <p className="font-bold">48 000 SEK</p>
              </div>
              {/* 							<p className="absolute bottom-4">46 000 SEK*</p> */}
            </Card>
            <Card className="bg-silver relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-2xl">Silver</h3>
              <ul className="font-lato mt-2">
                {dict.silverItems.map((item, index) => (
                  <li
                    className={index < 7 ? "my-2 font-extrabold" : "my-2"}
                    key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-4">
                {/* <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p className="font-bold">69 000 SEK</p> */}
                <p className="text-sm font-bold">
                  {dict.standardRegistrationPrice}
                </p>
                <p className="font-bold">78 000 SEK</p>
              </div>
              {/* 							<p className="absolute bottom-4">71 500 SEK*</p> */}
            </Card>
            <Card className="bg-pineapple relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-licorice text-2xl">Gold</h3>
              <ul className="font-lato text-licorice mt-2">
                {dict.goldItems.slice(0, 6).map(item => (
                  <li className="my-2 font-extrabold" key={item}>
                    {item}
                  </li>
                ))}
                <li className="my-2 ml-4 text-sm">{dict.goldEventDetails}</li>
                {dict.goldItems.slice(6).map((item, index) => (
                  <li
                    className={index < 3 ? "my-2 font-extrabold" : "my-2"}
                    key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-4">
                {/* <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p className="font-bold">105 000 SEK</p> */}
                <p className="text-sm font-bold">
                  {dict.standardRegistrationPrice}
                </p>
                <p className="font-bold">120 000 SEK</p>
              </div>
              {/* 							<p className="absolute bottom-4">108 500 SEK*</p> */}
            </Card>
          </div>
        </div>
        {/* <p className="mt-4 text-sm">*All prices are ex. VAT. </p> */}
        <div className="mx-auto mt-12 w-full max-w-150">
          <Page.Header tier="secondary">{dict.customKitHeading}</Page.Header>
          <p className="mt-2">{dict.customKitIntro}</p>
          <ul className="mt-4 ml-4 list-disc space-y-2">
            {dict.customKitItems.map(item => (
              <li key={item.title}>
                <strong>{item.title}</strong> — {item.body}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            {dict.customKitContactPrefix}{" "}
            <Link
              className="underline hover:no-underline"
              href="mailto:sales@armada.nu">
              sales@armada.nu
            </Link>{" "}
            {dict.customKitContactSuffix}
          </p>
          <Page.Header tier="secondary" className="mt-8">
            {dict.focusRoomsHeading}
          </Page.Header>
          <p className="mt-2">{dict.focusRoomsIntro}</p>
          <ul className="mt-4 ml-4 list-disc space-y-3">
            {dict.focusRoomItems.map(item => (
              <li key={item.title}>
                <strong>{item.title}</strong> — {item.body}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto mt-10 w-full max-w-150">
          <Page.Header tier="secondary" className="mb-3">
            {dict.faqHeading}
          </Page.Header>
          <Accordion type="single" collapsible className="space-y-6">
            {/* FAQ 1 */}
            <AccordionItem value="faq-1">
              <AccordionTrigger>{dict.priorityQuestion}</AccordionTrigger>
              <AccordionContent>
                <p>
                  {dict.priorityAnswerPrefix}{" "}
                  <Link
                    className="underline hover:no-underline"
                    href="mailto:sales@armada.nu">
                    sales@armada.nu
                  </Link>{" "}
                  {dict.priorityAnswerSuffix}
                </p>
              </AccordionContent>
            </AccordionItem>
            {/* FAQ 2 */}
            <AccordionItem value="faq-2">
              <AccordionTrigger>{dict.registrationQuestion}</AccordionTrigger>
              <AccordionContent>
                <p>{dict.priorityRegistrationAnswer}</p>
                <p className="mt-3">{dict.standardRegistrationAnswer}</p>
                <p className="mt-3">{dict.firstSignupAnswer}</p>
                <p className="mt-3">
                  {dict.timelinePrefix}{" "}
                  <Link
                    className="underline hover:no-underline"
                    href={withLocale("/exhibitor/timeline")}>
                    {dict.timelineLink}
                  </Link>{" "}
                  {dict.timelineSuffix}
                </p>
              </AccordionContent>
            </AccordionItem>
            {/* FAQ 3 */}
            <AccordionItem value="faq-3">
              <AccordionTrigger>{dict.signupQuestion}</AccordionTrigger>
              <AccordionContent>
                <p>{dict.signupIntro}</p>
                <div className="my-4">
                  <TrackedLink
                    href={signupUrl}
                    tracking={{
                      eventName: "exhibitor_signup_click",
                      eventData: { location: "exhibitor_packages_faq" }
                    }}>
                    <Button className="bg-grapefruit text-snow">
                      {dict.signupButton}
                    </Button>
                  </TrackedLink>
                </div>
                <p>
                  {dict.signupContactPrefix}{" "}
                  <Link
                    className="underline hover:no-underline"
                    href="mailto:sales@armada.nu">
                    sales@armada.nu
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
