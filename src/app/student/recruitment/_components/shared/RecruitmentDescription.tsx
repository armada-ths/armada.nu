import { P } from "@/app/_components/Paragraph"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import Link from "next/link"

export async function RecruitmentDescription() {
  const organization = await fetchOrganization({
    next: {
      revalidate: 86400
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
        As a volunteer in Armada you get to be a part of a super important
        project that really helps the students at KTH find their dream employer.
        Doing this, you get valuable experience and learn soft skills that will
        help you in the future, and you get to meet amazing new people outside
        your chapter and make new friends.
      </P>
      <P className="mt-4">You also get some material benefits, such as:</P>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        <li>
          Spot at the grand banquet - the fanciest student party on KTH.
          Previous locations have been Münchenbryggeriet, Globen and Berns.
        </li>
        <li>Armada merch.</li>
        <li>Teambuildings together with your team.</li>
        <li>
          Big kick-out event after the fair. Previous events have been for
          example a cruise.
        </li>
      </ul>
      <P className="mt-5">
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
