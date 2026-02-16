import { P } from "@/app/(frontend)/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/(frontend)/_components/PhotoSlideCarousel"
import { OrganisationMembersGraphic } from "@/app/(frontend)/about/_components/OrganisationMembersGraphic"
import { Page } from "@/components/shared/Page"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `About Armada`,
  description: "Learn more about Armada"
}

export default async function RecruitmentPage() {
  const photoSrc: { source: string; altText: string }[] = [
    {
      source: "/fair_pictures/23031965122_efd3a80707_c.jpg",
      altText: "Students laying down carpet"
    },
    {
      source: "/fair_pictures/53396499463_86ddb61379_k.jpg",
      altText: "Student talking with company representative"
    },
    {
      source: "/fair_pictures/49121988801_f0b111943f_k.jpg",
      altText: "Crowd walking around the Armada fair"
    },
    {
      source: "/fair_pictures/49122130686_297ea7d00a_o.jpg",
      altText: "Student interacting with robot"
    }
  ]

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={750}>
        <Page.Header>About Armada</Page.Header>
        <PhotoSlideCarousel photoSrc={photoSrc} />
        <P className="mt-4">
          Armada was founded in 1981 and has since then organized a career fair
          that has grown to become one of the largest in scandinavia. We exist
          to connect students to their dream employer and have since come up
          with different events and happenings to create personal connections
          between students and employers.
        </P>
        <P className="mt-4">
          Each year, Armada goes from 1 student, the Project Manager, to over
          200 student volunteers managing a fair over two days, in several
          locations and 20 000 visitors. As Armada is fully owned by{" "}
          <Link
            className="underline hover:no-underline"
            href="https://thskth.se/en/">
            THS
          </Link>
          , the student union at KTH, any profit Armada makes goes back to the
          students, funding THS initiatives for a better student life.
        </P>

        <div className="flex w-full justify-center">
          <OrganisationMembersGraphic />
        </div>

        <div className="mt-8">
          <h2 className="font-bebas-neue text-melon-700 text-3xl font-medium">
            PM
          </h2>
          <P>
            The Project Manager (PM) is elected by the THS board in november.
            The PM is working full time with Armada and is responsible for the
            entire project. They usually have been part of Armada before taking
            up this role.
          </P>
        </div>
        <div className="mt-8">
          <h2 className="font-bebas-neue text-melon-700 text-3xl font-medium">
            Project group
          </h2>
          <P>
            The Project Group (PG) is chosen by the Project Manager in
            December/January. They then work with Armada the whole calendar
            year. These are students who dedicate around 10 hours per week to
            making each Armada the best fair yet. The PG really gets close
            learning to work together, get to try to shoulder big
            responsibilities in a supportive and collaborative environment and
            most of all, have really fun together. Everyone who’s been a PG
            knows, there is a before and an after Armada.
          </P>
        </div>
        <div className="mt-8">
          <h2 className="font-bebas-neue text-melon-700 text-3xl font-medium">
            Operations team
          </h2>
          <P>
            The operations team are volunteers recruited in the spring, around
            April/May. They are Coordinators, responsible for a specific issue
            or process, Team Leaders, responsible for a team of Hosts and
            Developers, working with the Armada IT suite. Being an OT gives a
            good understanding of how Armada works within, and is the perfect
            first leadership experience. It is a lot of fun, and gives a lot of
            learning opportunities, for a medium amount of work.
          </P>
        </div>
        <div className="mt-8">
          <h2 className="font-bebas-neue text-melon-700 text-3xl font-medium">
            Hosts
          </h2>
          <P>
            The Hosts join Armada in the autumn, and being a Hosts is a special
            experience. Most hosts are career fair hosts, helping a couple of
            exhibitors to the fair and building the fair. You get to know your
            team, attend team buildings together and be a part of the Armada
            Grand Banquet - the most fancy party at KTH.{" "}
          </P>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
