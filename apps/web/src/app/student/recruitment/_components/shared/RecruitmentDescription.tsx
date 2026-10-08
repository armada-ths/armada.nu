import { P } from "@/app/_components/Paragraph"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import { createLocalePath, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import Link from "next/link"

const recruitmentDescriptionText: Record<
  Locale,
  {
    paragraphs: [string, string, string]
    benefits: string[]
    closingPrefix: string
    here: string
    closingMiddle: string
    hrLabel: string
  }
> = {
  en: {
    paragraphs: [
      "Armada is a rapidly growing organization that goes from 1 person to over 200 each year. Now you have the chance to be part of this amazing community of ambitious people who want to create something amazing: A huge career fair for all students at KTH!",
      "As a volunteer in Armada you get to be a part of a super important project that really helps the students at KTH find their dream employer. Doing this, you get valuable experience and learn soft skills that will help you in the future, and you get to meet amazing new people outside your chapter and make new friends.",
      "You also get some material benefits, such as:"
    ],
    benefits: [
      "Spot at the grand banquet - the fanciest student party on KTH. Previous locations have been Münchenbryggeriet, Globen and Berns.",
      "Armada merch.",
      "Teambuildings together with your team.",
      "Big kick-out event after the fair. Previous events have been for example a cruise."
    ],
    closingPrefix:
      "Below you can read more about different roles and you can get to know the Armada organization better",
    here: "here",
    closingMiddle: "If you have any questions you can contact our",
    hrLabel: "Head of Human Resources"
  },
  sv: {
    paragraphs: [
      "Armada är en snabbt växande organisation som går från 1 person till över 200 varje år. Nu har du chansen att bli en del av en fantastisk gemenskap av ambitiösa människor som vill skapa något stort: en arbetsmarknadsmässa för alla studenter på KTH.",
      "Som volontär i Armada får du vara en del av ett viktigt projekt som hjälper KTH-studenter att hitta sin drömarbetsgivare. Du får värdefull erfarenhet, utvecklar mjuka färdigheter som hjälper dig i framtiden och träffar nya människor utanför din sektion.",
      "Du får också några materiella förmåner, till exempel:"
    ],
    benefits: [
      "Plats på Grand Banquet - den finaste studentfesten på KTH. Tidigare platser har varit Münchenbryggeriet, Globen och Berns.",
      "Armada-merch.",
      "Teambuilding tillsammans med ditt team.",
      "Stort avslutningsevent efter mässan. Tidigare event har till exempel varit en kryssning."
    ],
    closingPrefix:
      "Nedan kan du läsa mer om olika roller och lära känna Armada-organisationen bättre",
    here: "här",
    closingMiddle: "Om du har frågor kan du kontakta vår",
    hrLabel: "Head of Human Resources"
  }
}

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
        <Link
          className="underline hover:no-underline"
          href={createLocalePath("/about", locale)}>
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
