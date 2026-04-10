import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { ApplyButton } from "@/app/student/recruitment/_components/ApplyButton"
import { FAQSection } from "@/app/student/recruitment/_components/FAQSection"
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
import { Sparkles } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
export const metadata: Metadata = {
  title: `Armada Recruitment`,
  description: "See available roles and apply to become a part of Armada"
}

export default async function RecruitmentPage() {
  const data = await fetchRecruitment({
    next: {
      revalidate: 60 // 60 seconds – reflect CMS updates quickly
    }
  })

  const organization = await fetchOrganization({
    next: {
      revalidate: 60 // 60 seconds – keep profile data fresh
    }
  })

  const groupEntries = Object.entries(data?.groups ?? {})
  const hasAvailableRoles = groupEntries.some(([, group]) => group.length > 0)
  const recruitmentName = data?.name || "Armada Recruitment"

  const hrHead = organization
    .flatMap(group => group.people)
    .find(person => {
      const role = person.role.toLowerCase()
      return role.includes("head of human resources")
    })

  const promotionalPhotos: { source: string; altText: string }[] = [
    {
      source: "/construction_pictures/Armada Construction Weekend-01.jpg",
      altText: "Armada construction weekend"
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-06.jpg",
      altText: "Armada construction weekend"
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-07.jpg",
      altText: "Armada construction weekend"
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-19.jpg",
      altText: "Armada construction weekend"
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-32.jpg",
      altText: "Armada construction weekend"
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-33.JPG",
      altText: "Armada construction weekend"
    }
  ]

  return (
    <>
      <div className="h-20" />
      <RecruitmentBanner />
      <Page.Background withIndents avoidHeader>
        <Page.Boundary maxWidth={750}>
          <Page.Header>{recruitmentName}</Page.Header>
          <div className="mb-20 mt-8 flex flex-1 flex-col">
            {/* <Page.Header tier="secondary">
            Open {DateTime.fromISO(data.start_date).toFormat("d MMM")} -{" "}
            {DateTime.fromISO(data.end_date).toFormat("d MMM")}
          </Page.Header> */}
            <Alert className="mb-4">
              <Sparkles size={20} />
              <AlertTitle>Become an Armada volunteer</AlertTitle>
              <AlertDescription>
                In Armada, over 200 volunteers join together to create one of
                KTH&apos;s biggest happenings. Take the opportunity to meet new
                friends, expand your network and be a part of something you can be
                really proud of!
              </AlertDescription>
            </Alert>
            <PhotoSlideCarousel photoSrc={promotionalPhotos} />
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
            <FAQSection />
            <div className="mt-14 hidden justify-center sm:flex">
              {data ? (
                <ApplyButton
                  href={data.link}
                  size="lg"
                  className="bg-grapefruit text-snow"
                  startDate={data.start_date}
                  endDate={data.end_date}
                  tracking={{ eventName: "recruitment_apply_click", eventData: { location: "recruitment_middle" } }}
                />
              ) : null}
            </div>
            <div className="flex-1">
              <Page.Header tier="secondary" className="mt-10 text-melon-700 text-4xl">
                {"Currently available roles"}
              </Page.Header>
              {hasAvailableRoles ? (
                <div>
                  <Accordion type="multiple">
                    {groupEntries.map(([name, group], index) => (
                      <div key={index} className={index === 0 ? "mt-3" : "mt-6"}>
                        <Page.Header tier="secondary">
                          {name}
                        </Page.Header>
                        {group.map(role => (
                          <AccordionItem
                            key={`${name}-${role.name}`}
                            value={`${name}::${role.name}`}
                            className="mt-3">
                            <AccordionTrigger>{role.name}</AccordionTrigger>
                            <AccordionContent className="pt-2 prose prose-sm max-w-none">
                              <ReactMarkdown
                                components={{
                                  p: (props) => (
                                    <P className="leading-7">{props.children}</P>
                                  ),
                                  ul: (props) => (
                                    <ul className="list-disc space-y-1 pl-5">{props.children}</ul>
                                  ),
                                  ol: (props) => (
                                    <ol className="list-decimal space-y-1 pl-5">{props.children}</ol>
                                  ),
                                  li: (props) => (
                                    <li className="leading-7">{props.children}</li>
                                  ),
                                  strong: (props) => (
                                    <strong className="font-bold">{props.children}</strong>
                                  ),
                                  em: (props) => (
                                    <em className="italic">{props.children}</em>
                                  ),
                                  h1: (props) => (
                                    <h1 className="text-lg font-bold mt-4 mb-2">{props.children}</h1>
                                  ),
                                  h2: (props) => (
                                    <h2 className="text-lg font-bold mt-4 mb-2">{props.children}</h2>
                                  ),
                                  h3: (props) => (
                                    <h3 className="text-base font-bold mt-3 mb-2">{props.children}</h3>
                                  )
                                }}>
                                {role.description}
                              </ReactMarkdown>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </div>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <Alert className="mt-6">
                  <AlertTitle>No available roles at the moment</AlertTitle>
                  <AlertDescription>
                    Keep an eye on this page for future opportunities to join our volunteer team!
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="mt-14 hidden justify-center sm:flex">
              {data ? (
                <ApplyButton
                  href={data.link}
                  size="lg"
                  className="bg-grapefruit text-snow"
                  startDate={data.start_date}
                  endDate={data.end_date}
                  tracking={{ eventName: "recruitment_apply_click", eventData: { location: "recruitment_bottom" } }}
                />
              ) : null}
            </div>
            <div className="sticky inset-x-4 bottom-8 z-20 mt-12 flex justify-center sm:hidden">
              {data ? (
                <ApplyButton
                  href={data.link}
                  variant="noShadow"
                  size="lg"
                  className="bg-grapefruit text-snow w-full max-w-[70vw]"
                  mobile
                  startDate={data.start_date}
                  endDate={data.end_date}
                  tracking={{ eventName: "recruitment_apply_click", eventData: { location: "recruitment_sticky_mobile" } }}
                />
              ) : null}
            </div>
          </div>
        </Page.Boundary>
      </Page.Background>
    </>
  )
}
