import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

export function FAQSection() {
  return (
    <div className="mx-auto mt-10 w-full max-w-187.5">
      <Page.Header className="text-licorice mb-2 text-3xl">FAQ</Page.Header>
      <Accordion type="single" collapsible className="space-y-6">
        <AccordionItem value="faq-1">
          <AccordionTrigger>
            How much work is it to be part of the Operations Team?
          </AccordionTrigger>
          <AccordionContent>
            <P className="mt-0 max-w-125">
              The time you need to spend on Armada as an OT varies between
              roles, but is usually 1-5 hours per week, with some roles having a
              more distributed workload and others requiring more time before
              and during the fair (17th - 18th November). Everyone in Armada is
              also expected to take part in the Construction Weekend before the
              fair (14th -15th November).
            </P>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>
            What is the difference between a Team Leader and a Coordinator?
          </AccordionTrigger>
          <AccordionContent>
            <P className="mt-0">
              The Operations Team (OT) consists of two types of roles, both
              essential to the project but with different focuses during the
              fair:
            </P>
            <P className="mt-4">
              <strong>Team Leader:</strong> You lead and manage a group of
              hosts. In addition to your planning responsibilities, you are
              responsible for delegating tasks, motivating your team, and
              overseeing their work during the fair.
            </P>
            <P className="mt-4">
              <strong>Coordinator:</strong> You are a specialist. Your focus is
              on independent planning, technical execution, or data management.
              While you do not lead a team of hosts, you collaborate closely
              across the organization to ensure your specific area runs
              smoothly.
            </P>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
