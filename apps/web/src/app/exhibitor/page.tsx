import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { CurrentStatus } from "@/app/exhibitor/_components/CurrentStatus"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature, getSignupUrl } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { VisitorNumberBar } from "@/components/shared/VisitorNumberBar"
import { Button } from "@/components/ui/button"
import { createLocalePath, translations, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"
import Link from "next/link"

const exhibitorPageTranslations: Record<
  Locale,
  {
    metadataTitle: string
    comingSoonTitle: string
    heading: string
    signupButton: string
    packagesButton: string
    timelineButton: string
    contactPrefix: string
    contactLink: string
    contactSuffix: string
    photos: [string, string, string, string]
    visitorLabels: {
      visits: string
      students: string
      networking: string
    }
    newStudentsHeading: string
    newStudentsBody: string
    characterHeading: string
    characterBody: string
    skillsHeading: string
    skillsBody: string
  }
> = {
  en: {
    metadataTitle: "Become an exhibitor at Armada",
    comingSoonTitle: "For Exhibitors",
    heading: "Why Armada",
    signupButton: "Signup to Armada",
    packagesButton: "Exhibitor Kits",
    timelineButton: "Exhibitor Timeline",
    contactPrefix: "Or",
    contactLink: "contact sales",
    contactSuffix: "if you have any questions",
    photos: [
      "Student talking to company representative",
      "Crowded room of students attending the fair",
      "Student interacting with robot",
      "Student talking with company representative"
    ],
    visitorLabels: {
      visits: "visits",
      students: "Students",
      networking: "of networking"
    },
    newStudentsHeading: "New students, every year!",
    newStudentsBody:
      "Every year, around 4000 new students come to KTH. Almost as many students get their first full time job or internship. Participating in Armada means you get access to all of them, and can both build awareness among younger students and be top of mind when the older students start looking for a job. Welcome!",
    characterHeading:
      'Do you write "we place high importance on your personal character" in job ads?',
    characterBody:
      "Armada realizes that what you study does not always decide where you end up in your career. Employers today must be attractive to a broad range of workers to recruit a diverse team and because you never know, your next star employee might have a different degree than you thought!",
    skillsHeading: "Skills you need, from all ends of KTH",
    skillsBody:
      "Did you know that there are at least five programmes at KTH teaching computer science and students from more than three programmes can call themselves mechanical engineers when applying for jobs?"
  },
  sv: {
    metadataTitle: "Bli utställare på Armada",
    comingSoonTitle: "För utställare",
    heading: "Varför Armada",
    signupButton: "Anmäl er till Armada",
    packagesButton: "Utställarkit",
    timelineButton: "Tidslinje för utställare",
    contactPrefix: "Eller",
    contactLink: "kontakta sales",
    contactSuffix: "om ni har några frågor",
    photos: [
      "Student pratar med företagsrepresentant",
      "Full mässhall med studenter",
      "Student interagerar med robot",
      "Student pratar med företagsrepresentant"
    ],
    visitorLabels: {
      visits: "besök",
      students: "Studenter",
      networking: "dagar med nätverkande"
    },
    newStudentsHeading: "Nya studenter, varje år!",
    newStudentsBody:
      "Varje år börjar omkring 4000 nya studenter på KTH. Nästan lika många studenter får sitt första heltidsjobb eller sin första praktikplats. Genom att delta i Armada får ni tillgång till dem alla, kan bygga kännedom hos yngre studenter och vara top of mind när äldre studenter börjar söka jobb. Välkomna!",
    characterHeading:
      'Skriver ni "vi lägger stor vikt vid personlig lämplighet" i era jobbannonser?',
    characterBody:
      "Armada vet att vad man studerar inte alltid avgör var man hamnar i karriären. Dagens arbetsgivare behöver vara attraktiva för en bred grupp kandidater för att kunna rekrytera mångsidiga team. Man vet aldrig - nästa stjärnmedarbetare kanske har en annan examen än ni först tänkte er!",
    skillsHeading: "Kompetensen ni behöver, från hela KTH",
    skillsBody:
      "Visste ni att det finns minst fem program på KTH som undervisar i datalogi, och att studenter från fler än tre program kan kalla sig maskiningenjörer när de söker jobb?"
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()

  return {
    title: exhibitorPageTranslations[locale].metadataTitle
  }
}

export default async function ForExhibitorsPage() {
  const locale = await getRequestLocale()
  const dict = exhibitorPageTranslations[locale]
  const sharedDict = translations[locale]
  const withLocale = (path: string) => createLocalePath(path, locale)
  const showExhibitorMain = await feature("EXHIBITOR_MAIN_PAGE")
  if (!showExhibitorMain) {
    return <ComingSoonPage title={dict.comingSoonTitle} />
  }

  const signupUrl = await getSignupUrl()
  const promotionalPhotos: { source: string; altText: string }[] = [
    {
      source: "/fair_pictures/49121473038_5876d71e29_b.jpg",
      altText: dict.photos[0]
    },
    {
      source: "/fair_pictures/49121988801_f0b111943f_k.jpg",
      altText: dict.photos[1]
    },
    {
      source: "/fair_pictures/49122130686_297ea7d00a_o.jpg",
      altText: dict.photos[2]
    },
    {
      source: "/fair_pictures/53396499463_86ddb61379_k.jpg",
      altText: dict.photos[3]
    }
  ]
  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={600} className="pb-20">
        <Page.Header tier="primary">{dict.heading}</Page.Header>
        <div className="h-4" />

        <VisitorNumberBar labels={dict.visitorLabels} />

        <div className="flex flex-col space-y-4 py-6">
          <div className="mt-2 flex flex-row flex-wrap justify-stretch gap-4">
            <Button asChild className="bg-grapefruit text-snow">
              <TrackedLink
                href={signupUrl}
                tracking={{
                  eventName: "exhibitor_signup_click",
                  eventData: { location: "exhibitor_why_armada" }
                }}>
                {dict.signupButton}
              </TrackedLink>
            </Button>
            <Button asChild variant={"neutral"}>
              <Link href={withLocale("/exhibitor/packages")}>
                {dict.packagesButton}
              </Link>
            </Button>
            <Button asChild variant={"neutral"}>
              <Link href={withLocale("/exhibitor/timeline")}>
                {dict.timelineButton}
              </Link>
            </Button>
          </div>
          <p className="text-xs">
            {dict.contactPrefix}{" "}
            <Link
              className="underline hover:no-underline"
              href="mailto:sales@armada.nu">
              {dict.contactLink}
            </Link>{" "}
            {dict.contactSuffix}
          </p>
        </div>
        <CurrentStatus />
        <section className="flex flex-col gap-y-12">
          <div className="mt-12">
            <Page.Header tier="secondary">
              {dict.newStudentsHeading}
            </Page.Header>
            <P>{dict.newStudentsBody}</P>
          </div>

          <div>
            <Page.Header tier="secondary">{dict.characterHeading}</Page.Header>
            <P>{dict.characterBody}</P>
          </div>
          <div>
            <Page.Header tier="secondary">{dict.skillsHeading}</Page.Header>
            <P>{dict.skillsBody}</P>
          </div>
        </section>
        <PhotoSlideCarousel photoSrc={promotionalPhotos} />
      </Page.Boundary>
    </Page.Background>
  )
}
