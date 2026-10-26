import { localeAlternates } from "@/i18n/metadata"
import { P } from "@/app/_components/Paragraph"
import { QuestionGenerator } from "@/app/[locale]/student/at-the-fair/_components/QuestionGenerator"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { Page } from "@/components/shared/Page"
import { feature } from "@/components/shared/feature"
import { translations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"

import { atFairTranslations } from "@/i18n/dictionaries"

export async function generateMetadata() {
  return localeAlternates("/student/at-the-fair")
}

export default async function AtFairPage() {
  const locale = await getRequestLocale()
  const dict = atFairTranslations[locale]
  const sharedDict = translations[locale]
  const showAtFair = await feature("AT_FAIR_PAGE")
  if (!showAtFair) {
    return <ComingSoonPage title={sharedDict.atTheFair} />
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>{dict.heading}</Page.Header>
        <div>
          <P>{dict.intro}</P>

          <ul className="mt-2">
            {dict.tips.map(tip => (
              <li key={tip}>
                <i>· {tip}</i>
              </li>
            ))}
          </ul>

          <P>{dict.reminder}</P>
        </div>
        <br />
        <Page.Header tier="secondary" className="text-melon">
          {dict.exampleHeading}
        </Page.Header>
        <P>{dict.exampleIntro}</P>
        {/*INSERT QUESTION GENERATOR HERE*/}
        <QuestionGenerator
          eyebrow={dict.questionEyebrow}
          emptyText={dict.emptyQuestion}
          buttonText={dict.generateQuestion}
          questions={dict.questions}
        />
        <br />
        <div className="self-center"></div>
      </Page.Boundary>
    </Page.Background>
  )
}
