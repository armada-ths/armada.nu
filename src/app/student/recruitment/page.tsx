import { P } from "@/app/_components/Paragraph"
import { ApplyButton } from "@/app/student/recruitment/_components/ApplyButton"
import { Page } from "@/components/shared/Page"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Metadata } from "next"
import Link from "next/link"
export const metadata: Metadata = {
  title: `Armada Recruitment`,
  description: "See available roles and apply to become a part of Armada"
}

export default async function RecruitmentPage() {
  const data = await fetchRecruitment({
    next: {
      revalidate: 86400 // once a day
    }
  })

  const organization = await fetchOrganization({
    next: {
      revalidate: 60 // 60 seconds – keep profile data fresh
    }
  })

  // const group = organization.find(group =>
  //   group.name.includes("Project Manager")
  // )

  // const profile = group?.people.find(person =>
  //   person.role.match("Project Manager")
  // )

  const hrHead = organization
    .flatMap(group => group.people)
    .find(person => {
      const role = person.role.toLowerCase()
      return (
        role.includes("head of human resources")
      )
    })

  const roleAccordionValues = Object.entries(data.groups).flatMap(
    ([groupName, group]) =>
      group.map(role => `${groupName}::${role.name}`)
  )

  // const photoSrc: { source: string; altText: string }[] = [
  //   {
  //     source: "/fair_pictures/23031965122_efd3a80707_c.jpg",
  //     altText: "Students laying down carpet"
  //   },
  //   {
  //     source: "/fair_pictures/52520331777_e86eca961c_c.jpg",
  //     altText: "Students carrying Armada gear in the snow"
  //   },
  //   {
  //     source: "/fair_pictures/52521081094_8f551d2114_c.jpg",
  //     altText: "Student getting a drink"
  //   },
  //   {
  //     source: "/fair_pictures/52520926612_8f5d642178_c.jpg",
  //     altText: "Group of students posing for a photo in formal clothes"
  //   }
  // ]

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={750}>
        {/* PG 2026 recruitment (hidden for now) */}
        {/* <Page.Header>{data.name}</Page.Header>
        <div className="mt-8 mb-32 flex flex-1 flex-col">
          <Page.Header tier="secondary">
            Open {DateTime.fromISO(data.start_date).toFormat("d MMM")} -{" "}
            {DateTime.fromISO(data.end_date).toFormat("d MMM")}
          </Page.Header>
          {profile && <Profile profile={profile} />}
          <div className="mt-8 hidden justify-center sm:flex">
            <ApplyButton
              href={data.link}
              size="lg"
              className="bg-grapefruit text-snow"
            />
          </div>
          <RecruitmentDescription />
          <Testimonial />
          <div className="sticky inset-x-4 bottom-8 z-20 mt-12 flex justify-center sm:hidden">
            <ApplyButton
              href={data.link}
              variant="noShadow"
              size="lg"
              className="bg-grapefruit text-snow w-full max-w-[70vw]"
            />
          </div>
          <FAQSection /> */}
        <Page.Header>{data.name}</Page.Header>
        <div className="mb-20 mt-8 flex flex-1 flex-col">
          {/* <Page.Header tier="secondary">
            Open {DateTime.fromISO(data.start_date).toFormat("d MMM")} -{" "}
            {DateTime.fromISO(data.end_date).toFormat("d MMM")}
          </Page.Header> */}
          <Alert className="mb-4">
            <AlertTitle>Become an Armada volunteer</AlertTitle>
            <AlertDescription>
              In Armada, over 200 volunteers join together to create one of
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
                className="underline hover:no-underline"
                href="/about">
                here
              </Link>
              . If you have any questions you can contact our{" "}
              {hrHead && hrHead.email ? (
                <Link
                  className="underline hover:no-underline"
                  href={`mailto:${hrHead.email}`}>
                  Head of Human Resources
                </Link>
              ) : (
                "Head of Human Resources"
              )}
              .
            </P>
          </div>
          <div className="mt-10 hidden justify-center sm:flex">
            <ApplyButton
              href={data.link}
              size="lg"
              className="bg-grapefruit text-snow"
            />
          </div>
          <div className="flex-1">
            <Page.Header tier="secondary" className="mt-10 text-melon-700">
              {"Currently available roles"}
            </Page.Header>
            <Accordion type="multiple" defaultValue={roleAccordionValues}>
              {Object.entries(data.groups).map(([name, group], index) => (
                <div key={index} className="mt-4">
                  {/* <Page.Header tier="secondary">
                    {name}
                  </Page.Header> */}
                  {group.map(role => (
                    <AccordionItem
                      key={`${name}-${role.name}`}
                      value={`${name}::${role.name}`}>
                      <AccordionTrigger>{role.name}</AccordionTrigger>
                      <AccordionContent className="pt-2">
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
                              {/* {" "}
                              <Link
                                className="underline hover:no-underline"
                                href={data.link}>
                                {"Apply now!"}
                              </Link> */}
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
          <P className="mt-4">
            More roles will be available soon, stay tuned!
          </P>
          <div className="sticky inset-x-4 bottom-8 z-20 mt-12 flex justify-center sm:hidden">
            <ApplyButton
              href={data.link}
              variant="noShadow"
              size="lg"
              className="bg-grapefruit text-snow w-full max-w-[70vw]"
            />
          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
