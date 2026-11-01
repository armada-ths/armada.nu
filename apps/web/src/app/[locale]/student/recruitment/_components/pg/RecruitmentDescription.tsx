import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"

import { getRequestLocale } from "@/lib/i18n-server"

import { pgDescriptionText } from "@/i18n/dictionaries"

export async function RecruitmentDescription() {
  const locale = await getRequestLocale()
  const dict = pgDescriptionText[locale]

  return (
    <div className="my-8">
      <Page.Header className="text-4xl">{dict.heading}</Page.Header>
      <P>{dict.intro}</P>
      <P>{dict.areasIntro}</P>
      <Page.Header className="mt-6 text-2xl">{dict.eventsHeading}</Page.Header>
      <P>{dict.eventsBody}</P>
      <Page.Header className="mt-6 text-2xl">
        {dict.premisesHeading}
      </Page.Header>
      <P>{dict.premisesBody}</P>
      <Page.Header className="mt-6 text-2xl">
        {dict.marketingHeading}
      </Page.Header>
      <P>{dict.marketingBody}</P>
    </div>
  )
}
