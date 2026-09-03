import { Countdown, CountdownCard } from "@/app/_components/Countdown"
import { P } from "@/app/_components/Paragraph"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { Hero1 } from "@/components/hero7"
import { HighlightCard } from "@/components/highlight-card"
import { feature } from "@/components/shared/feature"
import {
  fetchDates,
  isExhibitorSignupOpen
} from "@/components/shared/hooks/api/useDates"
import { fetchHighlightCards } from "@/components/shared/hooks/api/useHighlightCards"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { Page } from "@/components/shared/Page"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { VisitorNumberBar } from "@/components/shared/VisitorNumberBar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createLocalePath, pageTranslations, translations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { DateTime } from "luxon"
import Link from "next/link"

export default async function HomePage() {
  const locale = await getRequestLocale()
  const pageDict = pageTranslations[locale].home
  const sharedDict = translations[locale]
  const withLocale = (path: string) => createLocalePath(path, locale)

  const [dates, exhibitorPackagesEnabled, highlightCards, recruitment] =
    await Promise.all([
      fetchDates(),
      feature("EXHIBITOR_PACKAGES"),
      fetchHighlightCards(),
      fetchRecruitment({ next: { revalidate: 86400 } })
    ])

  const now = DateTime.now()
  const recruitmentOpen =
    recruitment != null &&
    DateTime.fromISO(recruitment.start_date) <= now &&
    DateTime.fromISO(recruitment.end_date) >= now

  const exhibitorSignupEnabled = isExhibitorSignupOpen(dates)
  const signupUrl = exhibitorSignupEnabled
    ? "https://app.eventro.se/register/armada"
    : "/exhibitor/signup"
  const highlightCard = highlightCards.length > 0 ? highlightCards[0] : null

  const heroButtons = recruitmentOpen
    ? {
        primary: {
          text: sharedDict.joinArmada,
          url: withLocale("/student/recruitment"),
          tracking: {
            eventName: "student_signup_click",
            eventData: { location: "hero_primary" }
          }
        },
        secondary: {
          text: sharedDict.meetTheTeam,
          url: withLocale("/about/team")
        }
      }
    : {
        primary: {
          text: sharedDict.readOurBlog,
          url: withLocale("/blog"),
          tracking: {
            eventName: "blog_click",
            eventData: { location: "hero_primary" }
          }
        },
        secondary: {
          text: sharedDict.meetTheTeam,
          url: withLocale("/about/team")
        }
      }

  return (
    <>
      <NavigationMenu />
      <Page.Background>
        <RecruitmentBanner />
        <Page.Boundary className="">
          <Hero1
            heading={pageDict.heroHeading}
            description={pageDict.heroDescription}
            sideContent={
              highlightCard ? (
                <HighlightCard
                  title={highlightCard.title}
                  subtitle={highlightCard.subtitle}
                  description={highlightCard.description}
                  brand={highlightCard.brand}
                  ctaText={highlightCard.linkText}
                  ctaUrl={highlightCard.linkUrl}
                  ctaTracking={
                    highlightCard.linkUrl && highlightCard.ctaEventName
                      ? {
                          eventName: highlightCard.ctaEventName,
                          eventData: { location: "highlight_card" }
                        }
                      : undefined
                  }
                />
              ) : dates?.fair.days && dates.fair.days.length > 0 ? (
                <CountdownCard fairDays={dates.fair.days} />
              ) : undefined
            }
            bottomContent={
              highlightCard &&
              dates?.fair.days &&
              dates.fair.days.length > 0 ? (
                <Countdown fairDays={dates.fair.days} />
              ) : undefined
            }
            buttons={heroButtons}
          />
        </Page.Boundary>
        <Page.Boundary className="p-6 pt-12">
          {/* Time and place */}
          {/* <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:pl-4 relative overflow-visible">
            {today < fair_end ? (
              <div className="w-full flex-1 rounded pb-2 text-2xl font-medium mt-2 md:mt-0 overflow-visible">
                <CountdownTimer targetDate={new Date(`${dates.fair.days[0]}T10:00:00+01:00`)} />
              </div>
            ) : (
              <div className="mt-2 md:mt-0 sm:w-[40vw] flex-1">
                <h1 className=" text-4xl font-bebas-bold font-bold text-center text-licorice rounded-md">
                  ARMADA 2025 HAS ENDED
                </h1>
                <h2 className="text-melon">
                  Thank You to All Our Partners and Participants!
                </h2>
                <P>
                  Armada 2025 was a huge success because of your energy, innovation, and commitment.
                  We're grateful to every company and student who made this fair possible and memorable.
                  Together, we're shaping the future of talent and industry!
                  See you next year - let's keep building!
                </P>
              </div>
            )}
          </div> */}
          <section className="relative right-1/2 left-1/2 mx-[-50vw] mt-5 w-screen max-w-none overflow-y-visible">
            <VisitorNumberBar />
          </section>

          <div className="flex flex-col py-2 md:flex-row">
            {/* <div className="justify-center">
              <div className="md:mt-10 flex gap-2 text-melon">
                <p className="text-5xl font-bebas-neue justify-center">
                  VENUES
                </p>
                <MapPin className="mt-2 size-7" />
              </div>
              <div className="mt-4 md:mt-10 text-left mix-blend-normal">
                <h2 className="text-melon text-3xl font-bebas-neue">Nymble</h2>
                <p className="text-2xl">
                  Drottning Kristinas väg 15-19, 114 28 Stockholm
                </p>
              </div>
              <div className="mb-4 mt-4 md:mt-10 text-left mix-blend-normal">
                <h2 className="text-melon text-3xl font-bebas-neue">KTH Innovation</h2>
                <p className="text-2xl">
                  Teknikringen 1, 114 28 Stockholm
                </p>
              </div>
            </div> */}

            {/* <MapWrapper /> */}
          </div>
          {/* About section */}
          <Page.Header className="mt-8">{pageDict.aboutHeading}</Page.Header>
          <P className="mt-4">
            {pageDict.aboutBody}{" "}
            <Link
              className="underline hover:no-underline"
              href="https://thskth.se/en/">
              {pageDict.thsLinkLabel}
            </Link>
            {pageDict.aboutSuffix}
          </P>

          {/* <div className="flex w-full justify-center">
            <OrganisationMembersGraphic />
          </div> */}

          {/* Why Armada */}
          <Page.Header tier="secondary" className="text-melon mt-4 font-medium">
            {pageDict.newStudentsHeading}
          </Page.Header>
          <P>{pageDict.newStudentsBody}</P>

          {/* Links */}
          <div className="my-6 grid justify-items-center gap-6 text-center lg:grid-cols-2 lg:items-stretch lg:gap-8">
            {/* Card 1 */}
            <Card className="bg-melon/90! flex h-full w-full flex-col items-center rounded-md p-6 md:p-8">
              <h2 className="font-bebas-neue text-2xl font-medium md:text-3xl">
                {sharedDict.forExhibitors}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {exhibitorSignupEnabled ? (
                  <Button asChild className="bg-grapefruit text-snow">
                    <TrackedLink
                      href={signupUrl}
                      tracking={{
                        eventName: "exhibitor_signup_click",
                        eventData: { location: "exhibitor_landing_card" }
                      }}>
                      {pageDict.exhibitorSignup}
                    </TrackedLink>
                  </Button>
                ) : (
                  <Button asChild className="bg-grapefruit text-snow">
                    <Link href={withLocale("/exhibitor")}>
                      {sharedDict.whyArmada}
                    </Link>
                  </Button>
                )}
                {exhibitorPackagesEnabled && (
                  <Button asChild variant="neutral">
                    <Link href={withLocale("/exhibitor/packages")}>
                      {sharedDict.kits}
                    </Link>
                  </Button>
                )}
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="bg-melon/90! flex h-full w-full flex-col items-center rounded-md p-6 md:p-8">
              <h2 className="font-bebas-neue text-2xl font-medium md:text-3xl">
                {sharedDict.forStudents}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild className="bg-grapefruit text-snow">
                  <TrackedLink
                    href={withLocale("/student/recruitment")}
                    tracking={{
                      eventName: "student_signup_click",
                      eventData: { location: "for_students_card" }
                    }}>
                    {pageDict.joinUs}
                  </TrackedLink>
                </Button>
              </div>
            </Card>
          </div>
        </Page.Boundary>
      </Page.Background>
    </>
  )
}
