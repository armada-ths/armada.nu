import OrganizationList from "@/app/about/_components/OrganizationList"
import { Page } from "@/components/shared/Page"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Armada Organization`,
  description: "Meet all the volunteers that make Armada possible"
}

export default async function TeamPage() {
  const organization = await fetchOrganization({
    next: {
      revalidate: 518400 // 6 days (S3 caches the images for 7 days exactly, we want to revalidate before that, otherwise the images will not be loaded)
    }
  })

  return (
    <Page.Background withIndents className="justify-start">
      <Page.Boundary>
        <Page.Header>Meet the team</Page.Header>
        <div className="">
          {organization.map(group => (
            <OrganizationList key={group.name} group={group} />
          ))}
        </div>
      </Page.Boundary>
      <div className="h-20" />
    </Page.Background>
  )
}
