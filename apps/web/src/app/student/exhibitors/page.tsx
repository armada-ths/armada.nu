import ExhibitorSearch from "@/app/student/exhibitors/_components/ExhibitorSearch"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { Page } from "@/components/shared/Page"
import { Suspense } from "react"

export default async function ExhibitorsPage() {
  const showExhibitors = await feature("EXHIBITOR_PAGE")
  if (!showExhibitors) {
    return <ComingSoonPage title="Companies" />
  }

  const exhibitors = await fetchExhibitors({
    next: { revalidate: 86400 }
  })

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>Companies at ARMADA 2026</Page.Header>{" "}
        {/* TODO: Make year dynamic based on CMS data */}
        <Suspense>
          <ExhibitorSearch exhibitors={exhibitors} />
        </Suspense>
      </Page.Boundary>
    </Page.Background>
  )
}
