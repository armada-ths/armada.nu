import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"

export function RecruitmentDescription() {
  return (
    <div className="my-8">
      <Page.Header className="text-4xl">About PG</Page.Header>
      <P>
        The project group is a dynamic environment where initiative and
        innovation is the standard and no idea is too big. We grow like a
        start-up, from about 15 PG’s to 200 engaged students in just 9 months.
        Our huge scale allows the PG to gain valuable experience handling
        substantial budgets and leading large organizations, giving them
        responsibilities they would normally only encounter many years after
        graduating.
      </P>
      <P>
        While there’s no strict organisation of the project group, the general
        areas that we work with are:
      </P>
      <Page.Header className="mt-6 text-2xl">
        Events, sales & banquet
      </Page.Header>
      <P>
        Armada’s core focus is creating experiences that bring students and
        industry together. From events that spark ideas and connections, to
        seamless interactions between students and company representatives at
        the banquet, every aspect is designed to deliver a feeling of quality
        for our customers.
      </P>
      <Page.Header className="mt-6 text-2xl">Premises</Page.Header>
      <P>
        Armada is a huge apparatus with 20 000 fair visits, two locations and a
        lot of logistical challenges. This requires months of planning, a robust
        organisation with incisive leadership and creative solutions. These
        elements ensure that every part of the fair runs seamlessly and has an
        impressive impact on visitors.
      </P>
      <Page.Header className="mt-6 text-2xl">
        Marketing, recruitment & web
      </Page.Header>
      <P>
        Our fair, events and organisation needs strong marketing to reach the
        right students and companies, securing both engagement and lasting
        relationships year after year. Our marketing PG’s are not just web
        developers, designers and content creators, they are also sharp
        strategists keeping Armada’s goals at the center of everything they do.
      </P>
    </div>
  )
}
