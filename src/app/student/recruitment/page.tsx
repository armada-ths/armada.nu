import { ApplyButton } from "@/app/student/recruitment/_components/ApplyButton"
import { FAQSection } from "@/app/student/recruitment/_components/FAQSection"
import { Profile } from "@/app/student/recruitment/_components/Profile"
import { RecruitmentDescription } from "@/app/student/recruitment/_components/RecruitmentDescription"
import { Testimonial } from "@/app/student/recruitment/_components/Testimonial"
import { Page } from "@/components/shared/Page"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { Metadata } from "next"
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

  const group = organization.find(group =>
    group.name.includes("Project Manager")
  )

  const profile = group?.people.find(person =>
    person.role.match("Project Manager–Project Manager")
  )

  // const hrHead = {
  //   name: "Head of HR",
  //   email: ""
  // }

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

  // if (
  //   (data?.end_date &&
  //     DateTime.fromISO(data.end_date, { zone: "Europe/Stockholm" }).plus({ days: 1 }) < DateTime.now()) ||
  //   (data?.start_date && DateTime.fromISO(data.start_date, { zone: "Europe/Stockholm" }) > DateTime.now())
  // ) {
  //   return (
  //     <Page.Background withIndents>
  //       <Page.Boundary>
  //         <Page.Header>Armada Recruitment</Page.Header>
  //         <Page.Header tier="secondary">
  //           No available roles at the moment
  //         </Page.Header>
  //         <Alert className="my-5">
  //           <AlertTitle>Be an Armada volunteer</AlertTitle>
  //           <AlertDescription>
  //             In Armada over 200 volunteers join together to create one of
  //             KTH&apos;s biggest happenings. Take the opportunity to meet new
  //             friends, expand your network and be a part of something you can be
  //             really proud of!
  //           </AlertDescription>
  //         </Alert>
  //         <div>
  //           <P className="mt-4">
  //             Armada is a rapidly growing organization that goes from 1 person
  //             to over 200 each year. Now you have the chance to be part of this
  //             amazing community of ambitious people who want to create something
  //             amazing: A huge career fair for all students at KTH!
  //           </P>
  //           <P className="mt-4">
  //             Armada offers you a chance to meet students from all different
  //             chapters, get valuable experience on your CV, get closer to the
  //             exhibitors and have a lot of fun!
  //           </P>
  //           <P className="mt-4">
  //             Below you can read more about different roles and you can get to
  //             know the Armada organization better{" "}
  //             <Link
  //               className=" underline hover:no-underline"
  //               href="/about">
  //               here
  //             </Link>
  //             . If you have any questions you can contact the{" "}
  //             {hrHead && hrHead.email ? (
  //               <Link
  //                 className="underline hover:no-underline"
  //                 href={`mailto:${hrHead.email}`}>
  //                 Head of HR
  //               </Link>
  //             ) : (
  //               "Head of HR"
  //             )}
  //             .
  //           </P>
  //         </div>
  //       </Page.Boundary>
  //     </Page.Background>
  //   )
  // }

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={750}>
        <Page.Header>{data.name}</Page.Header>
        <div className="mt-8 mb-32 flex flex-1 flex-col">
          {/* <Page.Header tier="secondary">
            Open {DateTime.fromISO(data.start_date).toFormat("d MMM")} -{" "}
            {DateTime.fromISO(data.end_date).toFormat("d MMM")}
          </Page.Header> */}
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
          <FAQSection />
          {/* <Alert className="my-5">
            <AlertTitle>Be an Armada volunteer</AlertTitle>
            <AlertDescription>
              In Armada over 200 volunteers join together to create one of
              KTH&apos;s biggest happenings. Take the opportunity to meet new
              friends, expand your network and be a part of something you can be
              really proud of!
            </AlertDescription>
          </Alert> */}
          {/* <div>
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
              . If you have any questions you can contact the{" "}
              {hrHead && hrHead.email ? (
                <Link
                  className="underline hover:no-underline"
                  href={`mailto:${hrHead.email}`}>
                  Head of HRD
                </Link>
              ) : (
                "Head of HRD"
              )}
              .
            </P>
          </div> */}
          {/* <div className="flex-1">
            <Accordion type="single" collapsible>
              {Object.entries(data.groups).map(([name, group], index) => (
                <div key={index} className="mt-10">
                  <Page.Header tier="secondary">
                    {name}
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
          </div> */}
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
