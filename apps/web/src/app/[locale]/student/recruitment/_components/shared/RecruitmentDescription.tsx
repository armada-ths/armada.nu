import { P } from "@/app/_components/Paragraph"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"

import { getRequestLocale } from "@/lib/i18n-server"
import { Link } from "@armada/shared/i18n/navigation"

import { recruitmentDescriptionText } from "@/i18n/dictionaries"

export async function RecruitmentDescription() {
  const locale = await getRequestLocale()
  const dict = recruitmentDescriptionText[locale]
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
      <P className="mt-4">{dict.paragraphs[0]}</P>
      <P className="mt-4">{dict.paragraphs[1]}</P>
      <P className="mt-4">{dict.paragraphs[2]}</P>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        {dict.benefits.map(benefit => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
      <P className="mt-5">
        {dict.closingPrefix}{" "}
        <Link className="underline hover:no-underline" href={"/about"}>
          {dict.here}
        </Link>
        . {dict.closingMiddle}{" "}
        {hrHead && hrHead.email ? (
          <Link
            className="underline hover:no-underline"
            href={`mailto:${hrHead.email}`}>
            {dict.hrLabel}
          </Link>
        ) : (
          dict.hrLabel
        )}
        .
      </P>
    </div>
  )
}
