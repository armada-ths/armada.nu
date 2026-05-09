import ExhibitorSearch from "@/app/student/exhibitors/_components/ExhibitorSearch"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import {
  fetchEmployments,
  fetchExhibitors,
  fetchIndustries,
  fetchPrograms
} from "@/components/shared/hooks/api/useExhibitors"
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

  const employments = await fetchEmployments({
    next: { revalidate: 86400 }
  })

  const industries = await fetchIndustries({
    next: { revalidate: 86400 }
  })

  const programs = await fetchPrograms({
    next: { revalidate: 86400 }
  })
  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>Companies at the Fair 2025</Page.Header>{" "}
        {/* Remember to change/remove year when updated! */}
        <Suspense>
          <ExhibitorSearch
            exhibitors={exhibitors}
            employments={employments}
            industries={industries}
            programs={programs}
          />
        </Suspense>
      </Page.Boundary>
    </Page.Background>
  )
}
