import { RecruitmentRoles } from "./_components/shared/RecruitmentRoles"
import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import { localizedText } from "@armada/shared/i18n/routing"
import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { RecruitmentBanner } from "@/app/_components/Recruitment"
import { FAQSection } from "@/app/[locale]/student/recruitment/_components/host/FAQSection"
import { ApplyButton } from "@/app/[locale]/student/recruitment/_components/shared/ApplyButton"
import { EmailListSignup } from "@/app/[locale]/student/recruitment/_components/shared/EmailListSignup"
import { RecruitmentDescription } from "@/app/[locale]/student/recruitment/_components/shared/RecruitmentDescription"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { Page } from "@/components/shared/Page"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { translations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Sparkles } from "lucide-react"
import { DateTime } from "luxon"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"

import { recruitmentPageText } from "@/i18n/dictionaries"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = recruitmentPageText[locale]

  return pageMetadata("/student/recruitment", {
    ...(await localeAlternates("/student/recruitment")),
    title: dict.title,
    description: dict.description
  })
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
  const now = DateTime.now()
  const recruitmentOpen =
    data != null &&
    DateTime.fromISO(data.start_date) <= now &&
    DateTime.fromISO(data.end_date) >= now
  const recruitmentName =
    localizedText(locale, data?.name, data?.nameSv) || dict.title

  const emailSignupCopy = !hasAvailableRoles
    ? {
        title: dict.signupNoRolesTitle,
        description: dict.signupNoRolesBody
      }
    : recruitmentOpen
      ? {
          title: dict.signupOpenTitle,
          description: dict.signupOpenBody
        }
      : {
          title: dict.signupClosedTitle,
          description: dict.signupClosedBody
        }

  const promotionalPhotos: { source: string; altText: string }[] = [
    {
      source: "/construction_pictures/Armada Construction Weekend-01.jpg",
      altText: dict.title
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-06.jpg",
      altText: dict.title
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-07.jpg",
      altText: dict.title
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-19.jpg",
      altText: dict.title
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-32.jpg",
      altText: dict.title
    },
    {
      source: "/construction_pictures/Armada Construction Weekend-33.JPG",
      altText: dict.title
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
                  <RecruitmentRoles>
                    {groupEntries.map(([name, group], index) => (
                      <div
                        key={index}
                        className={index === 0 ? "mt-3" : "mt-6"}>
                        <Page.Header tier="secondary">
                          {localizedText(
                            locale,
                            name,
                            data?.groupNamesSv?.[name]
                          )}
                        </Page.Header>
                        {group.map(role => (
                          <AccordionItem
                            key={`${name}-${role.name}`}
                            value={`${name}::${role.name}`}
                            className="mt-3">
                            <AccordionTrigger>
                              {localizedText(locale, role.name, role.nameSv)}
                            </AccordionTrigger>
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
                                {localizedText(
                                  locale,
                                  role.description,
                                  role.descriptionSv
                                )}
                              </ReactMarkdown>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </div>
                    ))}
                  </RecruitmentRoles>
                </div>
              ) : null}
              <div className="mt-6">
                <EmailListSignup {...emailSignupCopy} />
              </div>
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
