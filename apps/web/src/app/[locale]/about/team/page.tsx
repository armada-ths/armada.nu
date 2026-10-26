import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import OrganizationList from "@/app/[locale]/about/_components/OrganizationList"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import { Page } from "@/components/shared/Page"
import { translations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"

import { teamText } from "@/i18n/dictionaries"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = teamText[locale]

  return pageMetadata("/about/team", {
    ...(await localeAlternates("/about/team")),
    title: dict.title,
    description: dict.description,
    robots: { index: false, follow: false }
  })
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
