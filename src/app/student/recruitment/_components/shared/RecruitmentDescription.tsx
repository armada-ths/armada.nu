import { P } from "@/app/_components/Paragraph"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import Link from "next/link"

export async function RecruitmentDescription() {
  const organization = await fetchOrganization({
    next: {
      revalidate: 60 // 60 seconds – keep profile data fresh
    }
  })

  const hrHead = organization
    .flatMap(group => group.people)
    .find(person => {
      const role = person.role.toLowerCase()
      return role.includes("head of human resources")
    })

  return (
    <div>
      <P className="mt-4">
        Armada is a rapidly growing organization that goes from 1 person to over
        200 each year. Now you have the chance to be part of this amazing
        community of ambitious people who want to create something amazing: A
        huge career fair for all students at KTH!
      </P>
      <P className="mt-4">
        Armada offers you a chance to meet students from all different chapters,
        get valuable experience on your CV, get closer to the exhibitors and
        have a lot of fun!
      </P>
      <P className="mt-4">
        Below you can read more about different roles and you can get to know
        the Armada organization better{" "}
        <Link className="underline hover:no-underline" href="/about">
          here
        </Link>
        . If you have any questions you can contact our{" "}
        {hrHead && hrHead.email ? (
          <Link
            className="underline hover:no-underline"
            href={`mailto:${hrHead.email}`}>
            Head of Human Resources
          </Link>
        ) : (
          "Head of Human Resources"
        )}
        .
      </P>
    </div>
  )
}
