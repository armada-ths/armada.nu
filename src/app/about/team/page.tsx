import OrganizationList from "@/app/about/_components/OrganizationList"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import { Page } from "@/components/shared/Page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Armada Organization`,
  description: "Meet all the volunteers that make Armada possible"
}

export default async function TeamPage() {
  const showTeamPage = await feature("ABOUT_TEAM_PAGE")
  if (!showTeamPage) {
    return <ComingSoonPage title="Team" />
  }

  const organization = await fetchOrganization({
    next: {
      revalidate: 60 // 60 seconds – keep profile data fresh
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
        <Page.Header>Meet the team</Page.Header>
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
