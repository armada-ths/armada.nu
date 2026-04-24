import { P } from "@/app/_components/Paragraph"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { Hero1 } from "@/components/hero7"
import { HighlightCard } from "@/components/highlight-card"
import { feature } from "@/components/shared/feature"
import { fetchDates, isExhibitorSignupOpen } from "@/components/shared/hooks/api/useDates"
import { fetchHighlightCards } from "@/components/shared/hooks/api/useHighlightCards"
import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { Page } from "@/components/shared/Page"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { VisitorNumberBar } from "@/components/shared/VisitorNumberBar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default async function HomePage() {
  const [dates, exhibitorPackagesEnabled, highlightCards] = await Promise.all([
    fetchDates(),
    feature("EXHIBITOR_PACKAGES"),
    fetchHighlightCards()
  ])

  const exhibitorSignupEnabled = isExhibitorSignupOpen(dates)
  const signupUrl = exhibitorSignupEnabled
    ? "https://app.eventro.se/register/armada"
    : "/exhibitor/signup"
  const highlightCard = highlightCards.length > 0 ? highlightCards[0] : null

  return (
    <>
      <NavigationMenu />
      <Page.Background>
        <RecruitmentBanner />
        <Page.Boundary className="">
          <Hero1
            heading={"Set Sail For Success"}
            description={
              "The No. 1 career fair at KTH Royal Institute of Technology"
            }
            sideContent={
              highlightCard && (
                <HighlightCard
                  title={highlightCard.title}
                  subtitle={highlightCard.subtitle}
                  description={highlightCard.description}
                  brand={highlightCard.brand}
                  ctaText={highlightCard.linkText}
                  ctaUrl={highlightCard.linkUrl}
                  ctaTracking={highlightCard.linkUrl && highlightCard.ctaEventName ? { eventName: highlightCard.ctaEventName, eventData: { location: "highlight_card" } } : undefined}
                />
              )
            }
            buttons={{
              primary: {
                text: "Join Armada",
                url: "/student/recruitment",
                tracking: { eventName: "student_signup_click", eventData: { location: "hero_primary" } }
              },
              secondary: {
                text: "About Armada",
                url: "/about"
              }
            }}
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
                  We’re grateful to every company and student who made this fair possible and memorable.
                  Together, we’re shaping the future of talent and industry!
                  See you next year - let’s keep building!
                </P>
              </div>
            )}
          </div> */}
          <section className="relative right-1/2 left-1/2 -mx-[50vw] mt-5 w-screen max-w-none overflow-y-visible">
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
          <Page.Header className="mt-8">About Armada</Page.Header>
          <P className="mt-4">
            Armada was founded in 1981 and has since then organized a career
            fair that has grown to become one of the largest in scandinavia. We
            exist to connect students to their dream employer and have since
            come up with different events and happenings to create personal
            connections between students and employers. As Armada is fully owned
            by{" "}
            <Link
              className="underline hover:no-underline"
              href="https://thskth.se/en/">
              THS
            </Link>
            , the student union at KTH, any profit Armada makes goes back to the
            students, funding THS initiatives for a better student life.
          </P>

          {/* <div className="flex w-full justify-center">
            <OrganisationMembersGraphic />
          </div> */}

          {/* Why Armada */}
          <Page.Header tier="secondary" className="mt-4 text-melon font-medium">
            New students, every year!
          </Page.Header>
          <P>
            Every year, around 4000 new students come to KTH. Almost as many
            students get their first full time job or internship. Participating
            in Armada means you get access to all of them, and can both build
            awareness among younger students and be top of mind when the older
            students start looking for a job. Welcome!
          </P>

          {/* Links */}
          <div className="my-6 grid gap-6 text-center md:grid-cols-2 md:items-stretch md:justify-items-center md:gap-8">
            {/* Card 1 */}
            <Card className="bg-melon/90! flex h-full w-[90vw] max-w-sm flex-col items-center rounded-md p-6 md:max-w-md md:p-8">
              <h2 className="font-bebas-neue text-2xl font-medium md:text-3xl">
                For Exhibitors
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {exhibitorSignupEnabled ? (
                  <Button asChild className="bg-grapefruit text-snow">
                    <TrackedLink
                      href={signupUrl}
                      tracking={{ eventName: "exhibitor_signup_click", eventData: { location: "exhibitor_landing_card" } }}
                    >
                      Exhibitor Signup
                    </TrackedLink>
                  </Button>
                ) : (
                  <Button asChild className="bg-grapefruit text-snow">
                    <Link href="/exhibitor">Why Armada?</Link>
                  </Button>
                )}
                {exhibitorPackagesEnabled && (
                  <Button asChild variant="neutral">
                    <Link href="/exhibitor/packages">Kits</Link>
                  </Button>
                )}
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="bg-melon/90! flex h-full w-[90vw] max-w-sm flex-col items-center rounded-md p-6 md:max-w-md md:p-8">
              <h2 className="font-bebas-neue text-2xl font-medium md:text-3xl">
                For Students
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild className="bg-grapefruit text-snow">
                  <TrackedLink
                    href="/student/recruitment"
                    tracking={{ eventName: "student_signup_click", eventData: { location: "for_students_card" } }}
                  >
                    Join Us!
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
