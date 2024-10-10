import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { Page } from "@/components/shared/Page"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { FAQItem } from "@/components/ui/faqitem"
import { env } from "@/env"
import { formatDate } from "@/lib/utils"
import { DateTime } from "luxon"
import { Metadata } from "next"
import Link from "next/link"
export const metadata: Metadata = {
  title: `Armada Recruitment`,
  description: "See available roles and apply to become a part of Armada"
}

export default async function RecruitmentPage() {
  const data = await fetchRecruitment({
    next: {
      revalidate: 3600 * 3 // 3 hours
    }
  })

  const organization = await fetchOrganization({
    next: {
      revalidate: 3600 * 24 * 6 // 6 days (S3 caches the images for 7 days exactly, we want to revalidate before that, otherwise the images will not be loaded)
    }
  })

  const group = organization.find(group =>
    group.name.includes("Marketing & Communications")
  )

  const hrHead = group?.people.find(people =>
    people.role.includes("Project Group – Head of Human Resources")
  )

  const dates = await fetchDates()

  const photoSrc: { source: string; altText: string }[] = [
    {
      source: "/fair_pictures/23031965122_efd3a80707_c.jpg",
      altText: "Students laying down carpet"
    },
    {
      source: "/fair_pictures/52520331777_e86eca961c_c.jpg",
      altText: "Students carrying Armada gear in the snow"
    },
    {
      source: "/fair_pictures/52521081094_8f551d2114_c.jpg",
      altText: "Student getting a drink"
    },
    {
      source: "/fair_pictures/52520926612_8f5d642178_c.jpg",
      altText: "Group of students posing for a photo in formal clothes"
    }
  ]

  if (data == null) {
    return (
      <Page.Background withIndents>
        <Page.Boundary>
          <Page.Header>Armada Recruitment</Page.Header>
          <Page.Header tier="secondary">
            No available roles at the moment
          </Page.Header>
          <Alert className="my-5">
            <AlertTitle>Be an Armada volunteer</AlertTitle>
            <AlertDescription>
              In Armada over 200 volunteers join together to create one of
              KTH&apos;s biggest happenings. Take the opportunity to meet new
              friends, expand your network and be a part of something you can be
              really proud of!
            </AlertDescription>
          </Alert>
          <div>
            <P className="mt-4">
              Armada is a rapidly growing organization that goes from 1 person
              to over 200 each year. Now you have the chance to be part of this
              amazing community of ambitious people who want to create something
              amazing: A huge career fair for all students at KTH!
            </P>
            <P className="mt-4">
              Armada offers you a chance to meet students from all different
              chapters, get valuable experience on your CV, get closer to the
              exhibitors and have a lot of fun!
            </P>
            <P className="mt-4">
              Below you can read more about different roles and you can get to
              know the Armada organization better{" "}
              <Link
                className="text-white underline hover:no-underline"
                href="/about">
                here
              </Link>
              . If you have any questions you can contact the{" "}
              {hrHead && hrHead.email ? (
                <Link
                  className="text-white underline hover:no-underline"
                  href={`mailto:${hrHead.email}`}>
                  Head of HR
                </Link>
              ) : (
                "Head of HR"
              )}
              .
            </P>
          </div>
        </Page.Boundary>
      </Page.Background>
    )
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={750}>
        <Page.Header>Armada Recruitment</Page.Header>
        <div className="mb-32 flex flex-1 flex-col">
          <Page.Header tier="secondary">
            Available roles - Open{" "}
            {DateTime.fromISO(data.start_date).toFormat("d MMM")} -{" "}
            {DateTime.fromISO(data.end_date).toFormat("d MMM")}
          </Page.Header>
          <PhotoSlideCarousel photoSrc={photoSrc} />
          <div className="m-8 flex justify-center">
            <Link href={`${env.NEXT_PUBLIC_API_URL}${data.link}`}>
              <Button size={"lg"}>
                Apply for Armada {DateTime.now().year}
              </Button>
            </Link>
          </div>
          <Alert className="my-5">
            <AlertTitle>Be an Armada volunteer</AlertTitle>
            <AlertDescription>
              In Armada over 200 volunteers join together to create one of
              KTH&apos;s biggest happenings. Take the opportunity to meet new
              friends, expand your network and be a part of something you can be
              really proud of!
            </AlertDescription>
          </Alert>
          <div>
            <P className="mt-4">
              Armada is a rapidly growing organization that goes from 1 person
              to over 200 each year. Now you have the chance to be part of this
              amazing community of ambitious people who want to create something
              amazing: A huge career fair for all students at KTH!
            </P>
            <P className="mt-4">
              Armada offers you a chance to meet students from all different
              chapters, get valuable experience on your CV, get closer to the
              exhibitors and have a lot of fun!
            </P>
            <P className="mt-4">
              Below you can read more about different roles and you can get to
              know the Armada organization better{" "}
              <Link
                className="text-white underline hover:no-underline"
                href="/about">
                here
              </Link>
              . If you have any questions you can contact the{" "}
              {hrHead && hrHead.email ? (
                <Link
                  className="text-white underline hover:no-underline"
                  href={`mailto:${hrHead.email}`}>
                  Head of HR
                </Link>
              ) : (
                "Head of HR"
              )}
              .
            </P>
          </div>
          <div className="flex-1">
            <Accordion type="single" collapsible>
              {Object.entries(data.groups).map(([name, group], index) => (
                <div key={index} className="mt-10">
                  <Page.Header tier="secondary">
                    {name.split("-")[1]}
                  </Page.Header>
                  {group.map(role => (
                    <AccordionItem key={role.name} value={role.name}>
                      <AccordionTrigger>{role.name}</AccordionTrigger>
                      <AccordionContent>
                        {role.description.split("\n").map(line =>
                          line.trimStart().startsWith("#") ? (
                            <P
                              key={line}
                              className="text-base font-bold leading-7">
                              {line.replace("#", "").trimStart()}
                            </P>
                          ) : (
                            <P key={line} className="leading-7">
                              {line}
                            </P>
                          )
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
              ))}
            </Accordion>
          </div>
          <div className="mx-auto mt-10 w-full max-w-[600px]">
            <h1 className="mb-2 ml-2 text-2xl">FAQ</h1>
            <Accordion type="single" collapsible={true}>
              <FAQItem title="How much time do I need to dedicate as a host for THS Armada?">
                The actual workload varies depending on your role as a host, but
                the rough estimates would be:
                <ul>
                  <li>
                    <b>October:</b> 1-3 hours per week for team-building
                    activities, meetings, and planning.
                  </li>
                  <li>
                    <b>November:</b> 3-8 hours per week as the workload
                    gradually increases to complete assigned tasks.
                  </li>
                  <li>
                    <b>Construction Weekend (the weekend before the fair):</b>{" "}
                    Full-day availability is required for construction
                    activities.
                  </li>
                  <li>
                    <b>
                      Fair Days ({formatDate(dates.fair.days[0])}-
                      {formatDate(dates.fair.days[1])}):
                    </b>{" "}
                    Full-day availability is required, depending on your role.
                  </li>
                </ul>
              </FAQItem>
            </Accordion>
          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
