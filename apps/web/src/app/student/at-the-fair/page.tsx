import { P } from "@/app/_components/Paragraph"
import { QuestionGenerator } from "@/app/student/at-the-fair/_components/QuestionGenerator"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { Page } from "@/components/shared/Page"
import { feature } from "@/components/shared/feature"
import { translations, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"

const atFairTranslations: Record<
  Locale,
  {
    heading: string
    intro: string
    tips: string[]
    reminder: string
    exampleHeading: string
    exampleIntro: string
    questionEyebrow: string
    emptyQuestion: string
    generateQuestion: string
    questions: string[]
  }
> = {
  en: {
    heading: "At the Fair",
    intro:
      "Walking up to a representative of a company you really want to work for can be intimidating! But don't fret, below we've collected some tips on how to get the most out of your conversation.",
    tips: [
      "Formulate your sentences and speak clearly.",
      "Treat it like a friendly chat.",
      "Show interest and ask questions."
    ],
    reminder:
      "Remember that you are not chatting with an AI who just knows facts about the company, but with another person. Think of it as a date with a company!",
    exampleHeading: "Example questions",
    exampleIntro:
      "Below are some examples of questions you can ask the companies during Armada to get the conversation started.",
    questionEyebrow: "Question for exhibitors:",
    emptyQuestion: "Press the button below to generate a question.",
    generateQuestion: "Generate Question",
    questions: [
      "How does your recruitment process look?",
      "If you could give your younger self advice about working in your field, what would it be?",
      "What advice do you have for someone about to graduate?",
      "What is the best memory you have from work?",
      "What is the biggest professional mistake you have made?",
      "What was the biggest change between studying and working?",
      "What made you choose your role?",
      "What does a typical day look like in your role?",
      "What character traits are important in your role?",
      "What tends to stand out in a cover letter?",
      "What's the best way to prepare for interviews?",
      "What's your best memory from university?",
      "What do you wish someone told you when you were newly graduated?",
      "Why did you start working at your company?",
      "How do you handle work-life balance?",
      "What do you think about the work environment?",
      "How long have you worked there?",
      "What does your company do?",
      "What's your role at your company?",
      "Why did you apply for the job in the first place?",
      "What are your suggestions for standing out during an interview?",
      "How does your company work with the sustainable development goals?"
    ]
  },
  sv: {
    heading: "På mässan",
    intro:
      "Att gå fram till en representant från ett företag du verkligen vill jobba för kan kännas nervöst. Här har vi samlat några tips på hur du kan få ut så mycket som möjligt av samtalet.",
    tips: [
      "Formulera dig tydligt och prata klart.",
      "Se det som ett vänligt samtal.",
      "Visa intresse och ställ frågor."
    ],
    reminder:
      "Kom ihåg att du inte pratar med en AI som bara kan fakta om företaget, utan med en annan person. Tänk på det som en dejt med ett företag!",
    exampleHeading: "Exempelfrågor",
    exampleIntro:
      "Här är några exempel på frågor du kan ställa till företagen under Armada för att komma igång med samtalet.",
    questionEyebrow: "Fråga till utställare:",
    emptyQuestion: "Tryck på knappen nedan för att generera en fråga.",
    generateQuestion: "Generera fråga",
    questions: [
      "Hur ser er rekryteringsprocess ut?",
      "Om du kunde ge ditt yngre jag ett råd om att arbeta inom ditt område, vad skulle det vara?",
      "Vilket råd har du till någon som snart tar examen?",
      "Vilket är ditt bästa minne från jobbet?",
      "Vilket är det största professionella misstaget du har gjort?",
      "Vad var den största skillnaden mellan att studera och att arbeta?",
      "Vad fick dig att välja din roll?",
      "Hur ser en typisk dag ut i din roll?",
      "Vilka personliga egenskaper är viktiga i din roll?",
      "Vad brukar sticka ut i ett personligt brev?",
      "Hur förbereder man sig bäst inför intervjuer?",
      "Vilket är ditt bästa minne från universitetet?",
      "Vad önskar du att någon hade sagt till dig när du var nyexaminerad?",
      "Varför började du arbeta på ditt företag?",
      "Hur hanterar du balansen mellan arbete och fritid?",
      "Hur upplever du arbetsmiljön?",
      "Hur länge har du arbetat där?",
      "Vad gör ert företag?",
      "Vilken roll har du på företaget?",
      "Varför sökte du jobbet från början?",
      "Vad är dina tips för att sticka ut under en intervju?",
      "Hur arbetar ert företag med de globala målen för hållbar utveckling?"
    ]
  }
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
