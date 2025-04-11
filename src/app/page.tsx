import { CompanyRegistrationButton } from "@/app/_components/CompanyRegistrationButton"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { Page } from "@/components/shared/Page"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, MapIcon } from "lucide-react"
import { DateTime } from "luxon"
//import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

export default async function HomePage() {
  const exhibitors = await fetchExhibitors()
  const dates = await fetchDates()
  const fr_end = new Date(dates.fr.end).getTime()
  const fair_start = new Date(dates.fair.days[0]).getTime()
  const fair_end = new Date(dates.fair.days[1]).getTime()
  const today = Date.now()

  const goldExhibitorOne = exhibitors.find(
    exhibitor => exhibitor.name === "Försvarsmakten"
  )
  const goldExhibitorTwo = exhibitors.find(
    exhibitor => exhibitor.name === "Nordea"
  )

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

      <Page.Background className="">
        <div className="mb-5 flex w-full flex-1 justify-center">
          <div className="mx-5 w-full max-w-[800px] pt-3 md:mx-10 md:pt-6">
            <Suspense>
              <RecruitmentBanner />
            </Suspense>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-y-5 pb-32 md:flex-row md:gap-y-40">
          <div className="flex flex-1">
            <div className="mx-auto flex max-w-[500px] flex-1">
              <div className="z-10 mx-10 flex flex-col md:flex-1">
                <h1 className="max-w-96 font-bebas-neue text-7xl text-melon-700">
                  Set Sail For Success
                </h1>
                <h2 className="my-5 text-stone-300">
                  The No. 1 career fair at KTH Royal Institute of Technology.
                  Where future engineers come in contact with career
                  opportunities and shape their future. November the 18th and
                  19th.
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
            </div>
          </div>
          <div className="z-10 flex flex-col items-center md:flex-1">
            {/*<div className="flex max-h-52 max-w-96 flex-col items-center justify-center gap-y-5 rounded-lg border-[1px] border-slate-200 bg-white bg-opacity-40 p-8">
						<Countdown />
					  </div> */}
            <h1 className="max-w-30 flex justify-center font-bebas-neue text-3xl text-stone-300">
              Are you an exhibitor?
            </h1>
            <div className="mt-4 flex w-full flex-wrap justify-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-20 px-10 pt-10">
                <Link href="/exhibitor">
                  <h1 className="cursor-pointer border-2 border-melon-700 px-6 py-6 font-bebas-neue text-8xl text-melon-700 transition-all duration-300 hover:scale-105 hover:bg-melon-700 hover:text-white hover:shadow-lg">
                    Why Armada?
                  </h1>
                </Link>
                {/*goldExhibitorOne && (
                  <Link href={`/student/exhibitors?id=${goldExhibitorOne.id}`}>
                    <Image
                      className="h-10 w-24 object-contain md:h-20 md:w-72"
                      src={goldExhibitorOne.logo_squared ?? ""}
                      alt={goldExhibitorOne.name}
                      width={200}
                      height={400}
                    />
                  </Link>
                )*/}
                {/*goldExhibitorTwo && (
                  <Link href={`/student/exhibitors?id=${goldExhibitorTwo.id}`}>
                    <div className="rounded-lg bg-white/90">
                      <Image
                        className="h-10 w-24 object-contain md:h-20 md:w-72"
                        src={"/exhibitorLogo/NordeaBankLogo.png"}
                        alt={goldExhibitorTwo.name}
                        width={200}
                        height={400}
                      />
                    </div>
                  </Link>
                )*/}
              </div>
            </div>
          </div>
        </div>
      </Page.Background>
    </>
  )
}
