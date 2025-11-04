import { CompanyRegistrationButton } from "@/app/_components/CompanyRegistrationButton"
import GoldExhibitors from "@/app/_components/GoldExhibitors"
import { P } from "@/app/_components/Paragraph"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import RollingBanner from "@/app/_components/RollingBannerSilver"
import { OrganisationMembersGraphic } from "@/app/about/_components/OrganisationMembersGraphic"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { Page } from "@/components/shared/Page"
import { VisitorNumberBar } from "@/components/shared/VisitorNumberBar"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, Clock } from "lucide-react"
//import Image from "next/image"
import { CountdownTimer } from "@/app/_components/CountdownTimer"
import DateCarousel from "@/app/_components/DatesCarousel"
import Link from "next/link"
import { Suspense } from "react"

export default async function HomePage() {
  const dates = await fetchDates()
  const goldExhibitors = await fetchExhibitors(undefined, { tier: "Gold" });
  const silverExhibitors = await fetchExhibitors(undefined, { tier: "Silver" });
  const silverLogos = silverExhibitors
    .map((g) => g.logoFreesize || g.logoSquared)
    .filter((url): url is string => Boolean(url));

  const fr_end = new Date(dates.fr.end).getTime()
  const today = Date.now()
  const fair_end = new Date(2025, 10, 19, 15, 0, 0).getTime()

  return (
    <>
      <NavigationMenu />
      <Page.Background>
        <Page.Boundary className="px-6">
          <div className="mb-5 flex w-full flex-1 justify-center">
            <div className="mx-5 w-full max-w-[800px] pt-3 md:mx-10 md:pt-6">
              <Suspense>
                <RecruitmentBanner />
              </Suspense>
            </div>
          </div>
          <div className="z-10 flex flex-col">
            <h1 className="max-w-96 font-bebas-neue text-7xl text-melon-700">
              Set Sail For Success
            </h1>
            <h2 className="my-5 text-stone-300">
              The No. 1 career fair at KTH Royal Institute of Technology. Where
              future engineers come in contact with career opportunities and
              shape their future. November 18th and 19th.
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {today < fr_end ? (
                <>
                  <CompanyRegistrationButton />
                  <Link href="/exhibitor/packages">
                    <Button
                      variant={"secondary"}
                      className="dark:bg-liqorice-700">
                      This Year&apos;s Packages
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/student/exhibitors">
                    <Button>
                      Exhibitors at the fair
                    </Button>
                  </Link>
                  <Link href="/student/events">
                    <Button
                      variant={"secondary"}
                      className="dark:bg-liqorice-700">
                      Sign up for events!
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
            {/*
                <Suspense>
                  <FairDates />
                </Suspense>
                */}
          </div>
        </Page.Boundary>
        <Page.Boundary className="p-6 pt-0">
          {/* Time and place */}
          {today < fair_end ? (
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:pl-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 flex w-full max-w-full flex-row md:w-1/4 overflow-hidden">
                <Clock
                  size={100}
                  strokeWidth={1.5}
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 40%, transparent 100%)",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "100% 100%",
                  }}
                  className="ml-2 text-melon-700"
                />
                <p className="-ml-1 mt-1 italic opacity-80">
                  Which
                  <br />
                  &nbsp;Dates?
                </p>
              </div>
              <DateCarousel />
              <div className="w-full flex-1 rounded pb-2 text-2xl font-medium">
                <CountdownTimer targetDate={new Date(`${dates.fair.days[0]}T10:00:00+01:00`)} />
              </div>
            </div>) : (<><h1 className="text-4xl font-bold text-center italic text-stone-300 border rounded-md py-6 border-dotted">ARMADA 2025 HAS ENDED</h1>
              {/* Thanks for another year */}
              <Page.Header className="mt-8">
                Thank You to All Our Partners and Participants!
              </Page.Header>
              <P className="mt-4">
                Armada 2025 was a huge success because of your energy, innovation, and commitment.
                We’re grateful to every company and student who made this fair possible and memorable.
                Together, we’re shaping the future of talent and industry!
                See you next year - let’s keep building!
              </P></>)}
          <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen max-w-none overflow-x-hidden overflow-y-visible mt-5">
            <VisitorNumberBar />
          </section>
          {/* Gold Exhibitors */}
          <GoldExhibitors exhibitors={goldExhibitors} />
          <RollingBanner logos={silverLogos} />
          {/* About section */}
          <Page.Header className="mt-8">About Armada</Page.Header>
          <P className="mt-4">
            Armada was founded in 1981 and has since then organized a career
            fair that has grown to become one of the largest in scandinavia. We
            exist to connect students to their dream employer and have since
            come up with different events and happenings to create personal
            connections between students and employers. As Armada is fully owned by{" "}
            <Link
              className="text-white underline hover:no-underline"
              href="https://thskth.se/en/">
              THS
            </Link>
            , the student union at KTH, any profit Armada makes goes back to the
            students, funding THS initiatives for a better student life.
          </P>

          <div className="flex w-full justify-center">
            <OrganisationMembersGraphic />
          </div>

          {/* Why Armada */}
          <h2 className="mt-4 font-bebas-neue text-3xl font-medium text-melon-700">
            New students, every year!
          </h2>
          <p className="text-stone-300">
            Every year, around 4000 new students come to KTH. Almost as many
            students get their first full time job or internship. Participating
            in Armada means you get access to all of them, and can both build
            awareness among younger students and be top of mind when the older
            students start looking for a job. Welcome!
          </p>

          {/* Links */}
          <div className="my-6 flex flex-col items-center gap-6 text-center md:flex-row md:justify-center md:gap-8">
            {/* Card 1 */}
            <div className="flex w-11/12 max-w-sm flex-col items-center rounded-md bg-green-950 bg-opacity-90 p-6 md:flex-1 md:max-w-md md:p-8">
              <h2 className="mb-4 font-bebas-neue text-2xl md:text-3xl font-medium text-melon-700">
                For Exhibitors
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="https://app.eventro.se/register/armada">
                  <Button>Exhibitor Signup</Button>
                </Link>
                <Link href="/exhibitor/packages">
                  <Button variant="secondary" className="dark:bg-liqorice-700">
                    Packages
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex w-11/12 max-w-sm flex-col items-center rounded-md bg-green-950 bg-opacity-90 p-6 md:flex-1 md:max-w-md md:p-8">
              <h2 className="mb-4 font-bebas-neue text-2xl md:text-3xl font-medium text-melon-700">
                For Students
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/student/recruitment">
                  <Button>Join Us!</Button>
                </Link>
              </div>
            </div>
          </div>
        </Page.Boundary>
      </Page.Background>
    </>
  )
}
