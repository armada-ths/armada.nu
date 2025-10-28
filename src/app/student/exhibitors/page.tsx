import ExhibitorSearch from "@/app/student/exhibitors/_components/ExhibitorSearch";
import { fetchEmployments, fetchExhibitors, fetchIndustries } from "@/components/shared/hooks/api/useExhibitors";
import { Page } from "@/components/shared/Page";
import { Suspense } from "react";

export default async function ExhibitorsPage() {
  const exhibitors = await fetchExhibitors({
    next: { revalidate: 3600 / 2 /* 30 min */ }
  })

  const employments = await fetchEmployments({
    next: { revalidate: 3600 / 2 /* 30 min */ }
  })

  const industries = await fetchIndustries({
    next: { revalidate: 3600 / 2 /* 30 min */ }
  })

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>Companies at the Fair</Page.Header>
        <Suspense>
          <ExhibitorSearch exhibitors={exhibitors} employments={employments} industries={industries} />
        </Suspense>
      </Page.Boundary>
    </Page.Background>
  )
}
