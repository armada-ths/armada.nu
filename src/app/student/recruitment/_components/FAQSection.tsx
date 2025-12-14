import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import Link from "next/link"

export function FAQSection() {
  return (
    <div className="mx-auto mt-10 w-full max-w-[600px]">
      <Page.Header className="text-licorice mb-2 text-3xl">FAQ</Page.Header>
      <Accordion type="single" collapsible className="space-y-6">
        <AccordionItem value="faq-1">
          <AccordionTrigger>
            How much work is it to be part of the project group?
          </AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-[500]">
              It is definitely a major commitment, like heading up a reception
              or being chairperson of the board at a student organization. We
              are all students who want to manage school though and some people
              are able to work part time at the same time. However, you will
              have much more fun if you see Armada as your main commitment
              outside of school.
            </P>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>
            What benefits do you get for being part of the project group?
          </AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-[500]">
              We have access to the Armada Office on the third floor in Nymble.
              We work, study and have AW:s here. We have some PG merch, go on
              some trips together and visit companies on events. Most of all, we
              get really close striving together towards making every year the
              best yet. You can find some behind the scenes on our{" "}
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
          <AccordionTrigger>
            Do I need to have been part of Armada before to qualify?
          </AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-[500]">
              No. There are a lot of other experiences that can qualify you as
              well, such as being part of other career fairs, student
              organizations or previous work experience etc. The most important
              thing is commitment and that you want to work on your leadership
              skills.
            </P>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
