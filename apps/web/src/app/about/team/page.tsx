import OrganizationList from "@/app/about/_components/OrganizationList"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import { Page } from "@/components/shared/Page"
import { translations, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"

const teamText: Record<
  Locale,
  { title: string; description: string; heading: string }
> = {
  en: {
    title: "Armada Organization",
    description: "Meet all the volunteers that make Armada possible",
    heading: "Meet the team"
  },
  sv: {
    title: "Armadas organisation",
    description: "Möt volontärerna som gör Armada möjligt",
    heading: "Träffa teamet"
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = teamText[locale]

  return {
    title: dict.title,
    description: dict.description
  }
}

export default async function TeamPage() {
  const locale = await getRequestLocale()
  const dict = teamText[locale]
  const showTeamPage = await feature("ABOUT_TEAM_PAGE")
  if (!showTeamPage) {
    return <ComingSoonPage title={translations[locale].team} />
  }

  const organization = await fetchOrganization({
    next: {
      revalidate: 86400
    }
  })

  const sortedOrganization = [...organization].sort((a, b) => {
    if (a.name === "Project Manager") return -1
    if (b.name === "Project Manager") return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <Page.Background withIndents className="justify-start">
      <Page.Boundary>
        <Page.Header>{dict.heading}</Page.Header>
        <div className="">
          {sortedOrganization.map(group => (
            <OrganizationList key={group.name} group={group} />
          ))}
        </div>
      </Page.Boundary>
      <div className="h-20" />
    </Page.Background>
  )
}
