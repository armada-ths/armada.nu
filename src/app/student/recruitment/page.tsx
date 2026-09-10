import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { FAQSection } from "@/app/student/recruitment/_components/host/FAQSection"
import { ApplyButton } from "@/app/student/recruitment/_components/shared/ApplyButton"
import { RecruitmentDescription } from "@/app/student/recruitment/_components/shared/RecruitmentDescription"
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
import { translations, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Sparkles } from "lucide-react"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"

const recruitmentPageText: Record<
  Locale,
  {
    title: string
    description: string
    alertTitle: string
    alertBody: string
    availableRoles: string
    noRolesTitle: string
    noRolesBody: string
  }
> = {
  en: {
    title: "Armada Recruitment",
    description: "See available roles and apply to become a part of Armada",
    alertTitle: "Become an Armada volunteer",
    alertBody:
      "In Armada, over 200 volunteers join together to create one of KTH's biggest happenings. Take the opportunity to meet new friends, expand your network and be a part of something you can be really proud of!",
    availableRoles: "Currently available roles",
    noRolesTitle: "No available roles at the moment",
    noRolesBody:
      "Keep an eye on this page for future opportunities to join our volunteer team!"
  },
  sv: {
    title: "Armadarekrytering",
    description: "Se lediga roller och ansök om att bli en del av Armada",
    alertTitle: "Bli volontär i Armada",
    alertBody:
      "I Armada går över 200 volontärer samman för att skapa ett av KTH:s största arrangemang. Ta chansen att träffa nya vänner, bredda ditt nätverk och vara en del av något du kan vara riktigt stolt över!",
    availableRoles: "Lediga roller just nu",
    noRolesTitle: "Inga lediga roller just nu",
    noRolesBody:
      "Håll utkik på den här sidan för framtida möjligheter att gå med i vårt volontärteam!"
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = recruitmentPageText[locale]

  return {
    title: dict.title,
    description: dict.description
  }
}

export default async function RecruitmentPage() {
  const locale = await getRequestLocale()
  const dict = recruitmentPageText[locale]
  const showRecruitment = await feature("STUDENT_RECRUITMENT_PAGE")
  if (!showRecruitment) {
    return <ComingSoonPage title={translations[locale].recruitment} />
  }

  const data = await fetchRecruitment({
    next: {
      revalidate: 86400
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
          <div className="mt-8 mb-20 flex flex-1 flex-col">
            {/* <Page.Header tier="secondary">
            Open {DateTime.fromISO(data.start_date).toFormat("d MMM")} -{" "}
            {DateTime.fromISO(data.end_date).toFormat("d MMM")}
          </Page.Header> */}
            <Alert className="mb-2">
              <Sparkles size={20} />
              <AlertTitle>{dict.alertTitle}</AlertTitle>
              <AlertDescription>{dict.alertBody}</AlertDescription>
            </Alert>
            <PhotoSlideCarousel photoSrc={promotionalPhotos} />
            <RecruitmentDescription />
            <FAQSection />
            <div className="mt-14 hidden justify-center sm:flex">
              {data ? (
                <ApplyButton
                  href={data.link}
                  size="lg"
                  className="bg-grapefruit text-snow"
                  startDate={data.start_date}
                  endDate={data.end_date}
                  tracking={{
                    eventName: "recruitment_apply_click",
                    eventData: { location: "recruitment_middle" }
                  }}
                />
              ) : null}
            </div>
            <div className="flex-1">
              <Page.Header
                tier="secondary"
                className="text-melon mt-14 text-4xl md:mt-10">
                {dict.availableRoles}
              </Page.Header>
              {hasAvailableRoles ? (
                <div>
                  <Accordion type="multiple">
                    {groupEntries.map(([name, group], index) => (
                      <div
                        key={index}
                        className={index === 0 ? "mt-3" : "mt-6"}>
                        <Page.Header tier="secondary">{name}</Page.Header>
                        {group.map(role => (
                          <AccordionItem
                            key={`${name}-${role.name}`}
                            value={`${name}::${role.name}`}
                            className="mt-3">
                            <AccordionTrigger>{role.name}</AccordionTrigger>
                            <AccordionContent className="prose prose-sm max-w-none pt-2">
                              <ReactMarkdown
                                components={{
                                  p: props => (
                                    <P className="leading-7">
                                      {props.children}
                                    </P>
                                  ),
                                  ul: props => (
                                    <ul className="list-disc space-y-1 pl-5">
                                      {props.children}
                                    </ul>
                                  ),
                                  ol: props => (
                                    <ol className="list-decimal space-y-1 pl-5">
                                      {props.children}
                                    </ol>
                                  ),
                                  li: props => (
                                    <li className="leading-7">
                                      {props.children}
                                    </li>
                                  ),
                                  strong: props => (
                                    <strong className="font-bold">
                                      {props.children}
                                    </strong>
                                  ),
                                  em: props => (
                                    <em className="italic">{props.children}</em>
                                  ),
                                  h1: props => (
                                    <h1 className="mt-4 mb-2 text-lg font-bold">
                                      {props.children}
                                    </h1>
                                  ),
                                  h2: props => (
                                    <h2 className="mt-4 mb-2 text-lg font-bold">
                                      {props.children}
                                    </h2>
                                  ),
                                  h3: props => (
                                    <h3 className="mt-3 mb-2 text-base font-bold">
                                      {props.children}
                                    </h3>
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
                  <AlertTitle>{dict.noRolesTitle}</AlertTitle>
                  <AlertDescription>{dict.noRolesBody}</AlertDescription>
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
                  tracking={{
                    eventName: "recruitment_apply_click",
                    eventData: { location: "recruitment_bottom" }
                  }}
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
                  tracking={{
                    eventName: "recruitment_apply_click",
                    eventData: { location: "recruitment_sticky_mobile" }
                  }}
                />
              ) : null}
            </div>
          </div>
        </Page.Boundary>
      </Page.Background>
    </>
  )
}
