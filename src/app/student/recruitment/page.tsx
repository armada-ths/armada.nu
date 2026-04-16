import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { ApplyButton } from "@/app/student/recruitment/shared/ApplyButton"
import { RecruitmentDescription } from "@/app/student/recruitment/shared/RecruitmentDescription"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { Page } from "@/components/shared/Page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"
export const metadata: Metadata = {
  title: `Armada Recruitment`,
  description: "See available roles and apply to become a part of Armada"
}

export default async function RecruitmentPage() {
  const showRecruitment = await feature("STUDENT_RECRUITMENT_PAGE")
  if (!showRecruitment) {
    return <ComingSoonPage title="Recruitment" />
  }

  const data = await fetchRecruitment({
    next: {
      revalidate: 60 // 60 seconds – reflect CMS updates quickly
    }
  })

  const groupEntries = Object.entries(data?.groups ?? {}).sort(([a], [b]) =>
    b.localeCompare(a)
  )
  const hasAvailableRoles = groupEntries.some(([, group]) => group.length > 0)
  const recruitmentName = data?.name || "Armada Recruitment"

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
            <Alert className="mb-2">
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
            <RecruitmentDescription />
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
              <Page.Header tier="secondary" className="mt-14 md:mt-10 text-melon-700 text-4xl">
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
