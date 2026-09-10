import { P } from "@/app/_components/Paragraph"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"
import Link from "next/link"

const exhibitorEventsText: Record<
  Locale,
  {
    title: string
    description: string
    comingSoon: string
    heading: string
    subtitle: string
    intro: string
    price: string
    location: string
    lunchTitle: string
    lunchBody: string
    lunchIncluded: string
    lunchAttendees: [string, string]
    panelTitle: string
    panelBody: string
    fieldTitle: string
    fieldLocation: string
    fieldBody: string
    afterWorkTitle: string
    afterWorkLocation: string
    afterWorkBody: string
    afterWorkOptions: [string, string]
    collaborativeTitle: string
    collaborativeSubtitle: string
    collaborativeBody: string
    videoFallback: string
    contactPrefix: string
  }
> = {
  en: {
    title: "Exhibitor Events - Armada",
    description: "The events we offer for exhibitors at Armada.",
    comingSoon: "Events",
    heading: "Exhibitor Events",
    subtitle: "Make the Most of Your Presence at Armada",
    intro:
      "Going beyond the booth is where real talent connections are made. These events give you dedicated time and space to showcase your brand, culture, and people to KTH's most driven students, on your terms. Pick a format, or build your own.",
    price: "Price",
    location: "Location",
    lunchTitle: "Lunch Lecture",
    lunchBody:
      "Own the room. Present your company, your culture, or a topic you're passionate about - while students enjoy a free lunch courtesy of you. It's a captive, curious audience in a relaxed setting, and one of the most effective ways to leave a lasting impression.",
    lunchIncluded:
      "Food is included for both students and your representatives.",
    lunchAttendees: ["60 attendees", "100 attendees"],
    panelTitle: "Panel Discussion",
    panelBody:
      "Position your company as a thought leader. Join a moderated, themed panel alongside representatives from other leading companies and engage students in an honest, dynamic conversation about industry trends, challenges, and careers. Great for brand credibility and visibility - and you might learn something too.",
    fieldTitle: "Field Visit",
    fieldLocation: "Your office",
    fieldBody:
      "Bring students into your world. Hosting a visit at your office is one of the most authentic ways to communicate who you are as an employer - your space, your team, your energy. Students get a real feel for what working with you looks like, and you get face time with motivated candidates in a setting where you're at your best.",
    afterWorkTitle: "After Work",
    afterWorkLocation: "Your office or Nymble",
    afterWorkBody:
      "Keep the conversation going after the fair floor closes. Host students for an informal mixer - at your own office for a more personal touch, or let us set it up for you at Nymble, THS's own pub. Whether you prefer casual mingling or structured networking, this is a low-pressure environment where real connections happen.",
    afterWorkOptions: ["At Nymble", "At your office"],
    collaborativeTitle: "Collaborative Events",
    collaborativeSubtitle: "Your concept, your way",
    collaborativeBody:
      "Have something more specific in mind? Design your own event - a workshop, live demo, hackathon, case competition, or anything else that reflects your brand. You bring the concept and the people; we handle the logistics and can arrange catering if needed.",
    videoFallback: "Your browser does not support the video tag.",
    contactPrefix: "Contact our events team for a quotation:"
  },
  sv: {
    title: "Utställarevent - Armada",
    description: "Eventen vi erbjuder utställare på Armada.",
    comingSoon: "Event",
    heading: "Utställarevent",
    subtitle: "Få ut mer av er närvaro på Armada",
    intro:
      "De starkaste kontakterna skapas ofta bortom montern. Våra event ger er egen tid och plats att visa upp ert varumärke, er kultur och era medarbetare för KTH:s mest drivna studenter, på era villkor. Välj ett format eller skapa ett eget.",
    price: "Pris",
    location: "Plats",
    lunchTitle: "Lunchföreläsning",
    lunchBody:
      "Äg rummet. Presentera ert företag, er kultur eller ett ämne ni brinner för medan studenterna får lunch av er. Det är en nyfiken publik i en avslappnad miljö och ett av de mest effektiva sätten att lämna ett starkt intryck.",
    lunchIncluded: "Mat ingår för både studenter och era representanter.",
    lunchAttendees: ["60 deltagare", "100 deltagare"],
    panelTitle: "Panelsamtal",
    panelBody:
      "Positionera ert företag som en tankeledare. Delta i ett modererat panelsamtal tillsammans med representanter från andra ledande företag och möt studenter i en ärlig och dynamisk diskussion om branschtrender, utmaningar och karriärer. Bra för trovärdighet, synlighet - och kanske lär ni er något också.",
    fieldTitle: "Företagsbesök",
    fieldLocation: "Ert kontor",
    fieldBody:
      "Bjud in studenter till er värld. Ett besök på ert kontor är ett av de mest genuina sätten att visa vilka ni är som arbetsgivare - era lokaler, ert team och er energi. Studenter får en verklig känsla för hur det är att arbeta hos er, och ni får tid med motiverade kandidater i en miljö där ni kommer till er rätt.",
    afterWorkTitle: "After Work",
    afterWorkLocation: "Ert kontor eller Nymble",
    afterWorkBody:
      "Fortsätt samtalet efter att mässgolvet stänger. Bjud in studenter till en informell träff på ert kontor för en mer personlig känsla, eller låt oss ordna den på Nymble, THS egen pub. Oavsett om ni föredrar mingel eller mer strukturerat nätverkande är detta en avslappnad miljö där riktiga kontakter skapas.",
    afterWorkOptions: ["På Nymble", "På ert kontor"],
    collaborativeTitle: "Samarbetsevent",
    collaborativeSubtitle: "Ert koncept, på ert sätt",
    collaborativeBody:
      "Har ni något mer specifikt i åtanke? Skapa ert eget event - en workshop, livedemo, hackathon, case competition eller något annat som speglar ert varumärke. Ni tar med konceptet och människorna; vi sköter logistiken och kan ordna catering vid behov.",
    videoFallback: "Din webbläsare stödjer inte videotaggen.",
    contactPrefix: "Kontakta vårt eventteam för offert:"
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = exhibitorEventsText[locale]

  return {
    title: dict.title,
    description: dict.description
  }
}

export default async function ExhibitorEventsPage() {
  const locale = await getRequestLocale()
  const dict = exhibitorEventsText[locale]
  const showEvents = await feature("EXHIBITOR_EVENTS")

  if (!showEvents) {
    return <ComingSoonPage title={dict.comingSoon} />
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto w-full max-w-150">
          <Page.Header>{dict.heading}</Page.Header>
          <p className="text-melon mt-1 text-lg font-medium">{dict.subtitle}</p>
          <div className="mt-4">
            <P className="max-w-125">{dict.intro}</P>
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-150">
          <Accordion
            type="multiple"
            defaultValue={["event-collaborative"]}
            className="space-y-6">
            <AccordionItem value="event-lunch-lecture">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">
                    {dict.lunchTitle}
                  </span>
                  <span className="text-sm opacity-80">
                    {dict.price}: 24,700 / 31,900 SEK excl. VAT
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>{dict.lunchBody}</p>
                <p className="mt-2">{dict.lunchIncluded}</p>
                <ul className="mt-2 ml-4 list-disc text-sm">
                  <li>{dict.lunchAttendees[0]}: 24,700 SEK</li>
                  <li>{dict.lunchAttendees[1]}: 31,900 SEK</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="event-panel-discussion">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">
                    {dict.panelTitle}
                  </span>
                  <span className="text-sm opacity-80">
                    {dict.price}: 9,300 SEK excl. VAT
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>{dict.panelBody}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="event-field-visit">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">
                    {dict.fieldTitle}
                  </span>
                  <span className="text-sm opacity-80">
                    {dict.location}: {dict.fieldLocation}
                  </span>
                  <span className="text-sm opacity-80">
                    {dict.price}: 9,300 SEK / 30 attendees excl. VAT
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>{dict.fieldBody}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="event-after-work">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">
                    {dict.afterWorkTitle}
                  </span>
                  <span className="text-sm opacity-80">
                    {dict.location}: {dict.afterWorkLocation}
                  </span>
                  <span className="text-sm opacity-80">
                    {dict.price}: 9,300 / 12,400 SEK excl. VAT
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>{dict.afterWorkBody}</p>
                <ul className="mt-2 ml-4 list-disc text-sm">
                  <li>{dict.afterWorkOptions[0]}: 12,400 SEK</li>
                  <li>{dict.afterWorkOptions[1]}: 9,300 SEK</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="event-collaborative">
              <AccordionTrigger>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl">
                    {dict.collaborativeTitle}
                  </span>
                  <span className="text-sm opacity-80">
                    {dict.collaborativeSubtitle}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <p>{dict.collaborativeBody}</p>
                <div className="mt-4">
                  <video
                    className="rounded-base border-border w-full border-2"
                    poster="/thumbnails/collaborative-events-thumbnail.png"
                    playsInline
                    controls
                    preload="metadata">
                    <source
                      src="https://rsdjnixgxqauonaofrwr.supabase.co/storage/v1/object/public/armada.nu-files/collaborative-events-marketing.mp4"
                      type="video/mp4"
                    />
                    {dict.videoFallback}
                  </video>
                </div>
                <p className="mt-2 text-sm">
                  {dict.contactPrefix}{" "}
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
