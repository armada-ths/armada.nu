import ExhibitorSearch from "@/app/student/exhibitors/_components/ExhibitorSearch";
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors";
import { Page } from "@/components/shared/Page";
import { Suspense } from "react";

export default async function ExhibitorsPage() {
  const exhibitors = await fetchExhibitors({
    next: { revalidate: 3600 / 2 /* 30 min */ }
  })


  // 🧩 Dynamically collect all industries from the data
  // går att hämta direkt från api, ändra i framtiden 
  const allIndustries = Array.from(
    new Map(
      exhibitors
        .flatMap((ex) => ex.industries || [])
        .map((ind) => [ind.id, ind])
    ).values()
  );

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>Companies at the Fair</Page.Header>
        <Suspense>
          <ExhibitorSearch exhibitors={exhibitors} />
        </Suspense>
      </Page.Boundary>
    </Page.Background>
  )
}
