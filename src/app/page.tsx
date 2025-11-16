import { CountdownTimer } from "@/app/_components/CountdownTimer"
import GoldExhibitors from "@/app/_components/GoldExhibitors"
import { P } from "@/app/_components/Paragraph"
import RollingBanner from "@/app/_components/RollingBannerSilver"
import { OrganisationMembersGraphic } from "@/app/about/_components/OrganisationMembersGraphic"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { Page } from "@/components/shared/Page"
import { VisitorNumberBar } from "@/components/shared/VisitorNumberBar"
import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"
//import Image from "next/image"
import DateCarousel from "@/app/_components/DatesCarousel"
import MapWrapper from "@/app/_components/MapWrapper"
// import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { Hero7 } from "@/components/hero7"
import { NavigationMenu } from "@/components/shared/NavigationMenu"
import Link from "next/link"

export default async function HomePage() {
  const dates = await fetchDates()
  const goldExhibitors = await fetchExhibitors(undefined, { tier: "Gold" });
  const silverExhibitors = await fetchExhibitors(undefined, { tier: "Silver" });
  const silverLogos = silverExhibitors
    .map((g) => g.logoFreesize || g.logoSquared)
    .filter((url): url is string => Boolean(url));

  return (
    <>
      <NavigationMenu />
      <Page.Background>
        <RecruitmentBanner />
        <Page.Boundary className="px-6">
          <Hero7
            heading={"Set Sail For Success"}
            description={"The No. 1 career fair at KTH Royal Institute of Technology"}
            buttons={{
              primary: {
                text: "View the map",
                url: "/student/map"
              },
              secondary: {
                text: "Exhibitors at the fair",
                url: "/student/exhibitors"
              }
            }} />

        </Page.Boundary>
        <Page.Boundary className="p-6 pt-0">
          {/* Time and place */}
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:pl-4 relative overflow-hidden">
            <div className="flex-row">
              <div className="justify-center absolute left-0 top-0 flex w-full max-w-full flex-row md:w-1/4 overflow-hidden">
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
                <div>
                  <p className="mt-1 italic opacity-80">
                    Which Dates?
                  </p>
                  <p className="mt-1 italic opacity-80">
                    Where?
                  </p>
                </div>
              </div>
              <div className="md:mt-4">
                <DateCarousel />
              </div>

              <p className="text-2xl text-melon-700 mix-blend-normal">
                Nymble & KTH Innovation
              </p>
            </div>
            <div className="w-full flex-1 rounded pb-2 text-2xl font-medium">
              <CountdownTimer targetDate={new Date(`${dates.fair.days[0]}T10:00:00+01:00`)} />
            </div>
          </div>
          <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen max-w-none overflow-x-hidden overflow-y-visible mt-5">
            <VisitorNumberBar />
          </section>
          {/* Gold Exhibitors */}
          <GoldExhibitors exhibitors={goldExhibitors} />
          <RollingBanner logos={silverLogos} />

          <div className="flex flex-col md:flex-row py-2">
            <div className="justify-center">
              <div className="md:mt-10 flex gap-2 text-melon-700">
                <p className="text-5xl font-bebas-neue justify-center">
                  VENUES
                </p>
                <MapPin className="mt-2 size-7" />
              </div>
              <div className="text-melon-700 mt-4 md:mt-10 text-left mix-blend-normal">
                <h2 className="text-3xl font-bebas-neue">Nymble</h2>
                <p className="text-2xl">
                  Drottning Kristinas väg 15-19, 114 28 Stockholm
                </p>
              </div>
              <div className="mb-4 text-melon-700 mt-4 md:mt-10 text-left mix-blend-normal">
                <h2 className="text-3xl font-bebas-neue">KTH Innovation</h2>
                <p className="text-2xl">
                  Teknikringen 1, 114 28 Stockholm
                </p>
              </div>
            </div>

            <MapWrapper />
          </div>
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
