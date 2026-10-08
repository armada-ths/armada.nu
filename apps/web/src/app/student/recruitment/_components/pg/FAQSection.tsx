import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import Link from "next/link"

const pgFaqText: Record<
  Locale,
  {
    workQuestion: string
    workBody: string
    benefitsQuestion: string
    benefitsBody: string
    qualifyQuestion: string
    qualifyBody: string
  }
> = {
  en: {
    workQuestion: "How much work is it to be part of the project group?",
    workBody:
      "It is definitely a major commitment, like heading up a reception or being chairperson of the board at a student organization. We are all students who want to manage school though and some people are able to work part time at the same time. However, you will have much more fun if you see Armada as your main commitment outside of school.",
    benefitsQuestion:
      "What benefits do you get for being part of the project group?",
    benefitsBody:
      "We have access to the Armada Office on the third floor in Nymble. We work, study and have AW:s here. We have some PG merch, go on some trips together and visit companies on events. Most of all, we get really close striving together towards making every year the best yet. You can find some behind the scenes on our",
    qualifyQuestion: "Do I need to have been part of Armada before to qualify?",
    qualifyBody:
      "No. There are a lot of other experiences that can qualify you as well, such as being part of other career fairs, student organizations or previous work experience etc. The most important thing is commitment and that you want to work on your leadership skills."
  },
  sv: {
    workQuestion:
      "Hur mycket arbete innebär det att vara med i projektgruppen?",
    workBody:
      "Det är ett stort åtagande, ungefär som att leda en mottagning eller vara ordförande i en studentorganisation. Samtidigt är vi alla studenter som vill klara skolan, och vissa kan även arbeta deltid samtidigt. Du kommer däremot ha mycket roligare om du ser Armada som ditt främsta engagemang utanför skolan.",
    benefitsQuestion:
      "Vilka förmåner får man av att vara med i projektgruppen?",
    benefitsBody:
      "Vi har tillgång till Armada Office på tredje våningen i Nymble. Här arbetar vi, pluggar och har AW. Vi har PG-merch, åker på resor tillsammans och besöker företag på event. Framför allt blir vi väldigt nära när vi tillsammans strävar efter att göra varje år till det bästa hittills. Du kan hitta bakom kulisserna-material på vår",
    qualifyQuestion:
      "Måste jag ha varit med i Armada tidigare för att kvalificera mig?",
    qualifyBody:
      "Nej. Det finns många andra erfarenheter som kan kvalificera dig, till exempel andra arbetsmarknadsmässor, studentorganisationer eller tidigare arbetslivserfarenhet. Det viktigaste är engagemang och att du vill utveckla ditt ledarskap."
  }
}

export async function FAQSection() {
  const locale = await getRequestLocale()
  const dict = pgFaqText[locale]

  return (
    <div className="mx-auto mt-10 w-full max-w-150">
      <Page.Header className="text-licorice mb-2 text-3xl">FAQ</Page.Header>
      <Accordion type="single" collapsible className="space-y-6">
        <AccordionItem value="faq-1">
          <AccordionTrigger>{dict.workQuestion}</AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-125">{dict.workBody}</P>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>{dict.benefitsQuestion}</AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-125">
              {dict.benefitsBody}{" "}
              <Link
                className="underline hover:no-underline"
                href="https://tiktok.com/@ths.armada">
                TikTok
              </Link>
              .
            </P>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>{dict.qualifyQuestion}</AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-125">{dict.qualifyBody}</P>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
