import { CompanyRegistrationButton } from "@/app/_components/CompanyRegistrationButton"
import { P } from "@/app/_components/Paragraph"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { OrganisationMembersGraphic } from "@/app/about/_components/OrganisationMembersGraphic"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { Page } from "@/components/shared/Page"
import { VisitorNumberBar } from "@/components/shared/VisitorNumberBar"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, Clock, MapIcon } from "lucide-react"
import { DateTime } from "luxon"
//import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

export default async function HomePage() {
  const dates = await fetchDates()
  const fr_end = new Date(dates.fr.end).getTime()
  const today = Date.now()

  const isAfterFr = DateTime.now() > DateTime.fromISO(dates.fr.end)

  return (
    <>
      {today < fr_end ? (
        <NavigationMenu />
      ) : (
        <NavigationMenu
          aside={
            isAfterFr ? (
              <Link href={"/student/map"}>
                <Button className="flex gap-2">
                  <MapIcon size={15} /> Visit the map
                </Button>
              </Link>
            ) : (
              <CompanyRegistrationButton />
            )
          }
        />
      )}

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
              shape their future. November the 18th and 19th.
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
                  <Link href="/student/map">
                    <Button className="flex gap-2">
                      <MapIcon size={15} /> Visit the map
                    </Button>
                  </Link>
                  <Link href="/student/events">
                    <Button variant={"secondary"} className="flex gap-2">
                      Signup for events
                      <ArrowRightIcon size={15} />
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
        <Page.Boundary className="p-6">
          {/* Time and place */}
          <div className="flex flex-1 flex-col items-center">
            <Clock />
            <p>November 18-19</p>
          </div>
          <VisitorNumberBar />
          {/* About section */}
          <Page.Header className="mt-8">About Armada</Page.Header>
          <P className="mt-4">
            Armada was founded in 1981 and has since then organized a career
            fair that has grown to become one of the largest in scandinavia. We
            exist to connect students to their dream employer and have since
            come up with different events and happenings to create personal
            connections between students and employers.
          </P>
          <P className="mt-4">
            Each year, Armada goes from 1 student, the Project Manager, to over
            200 student volunteers managing a fair over two days, in several
            locations and 20 000 visitors. As Armada is fully owned by{" "}
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
          <div className="flex items-center text-center">
            <div className="flex flex-1 flex-col items-center">
              <h2 className="mb-2 mt-4 flex-1 font-bebas-neue text-3xl font-medium text-melon-700">
                For Exhibitors
              </h2>
              <div className="flex flex-1 gap-x-3">
                <Link href="https://app.eventro.se/register/armada">
                  <Button>Exhibitor Signup</Button>
                </Link>
                <Link href="/exhibitor/packages">
                  <Button
                    variant={"secondary"}
                    className="dark:bg-liqorice-700">
                    Packages
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <h2 className="mt-4 flex-1 font-bebas-neue text-3xl font-medium text-melon-700">
                For Students
              </h2>
              <div className="flex flex-1 gap-x-3">
                <Link href="/student/recruitment">
                  <Button>Join Us!</Button>
                </Link>
                {/* <Link href="/exhibitor/packages">
                  <Button
                    variant={"secondary"}
                    className="dark:bg-liqorice-700">

                  </Button>
                </Link> */}
              </div>
            </div>
          </div>
        </Page.Boundary>
      </Page.Background>
    </>
  )
}
