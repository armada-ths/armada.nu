"use client"

import { ExhibitorCard } from "@/app/student/exhibitors/_components/ExhibitorCard"
import { Exhibitor, useExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { Page } from "@/components/shared/Page"
import { useEffect, useState } from "react"

export default function ExhibitorsPage() {
  const { exhibitors, loading, error, refetch } = useExhibitors();

  //const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [filteredExhibitors, setFilteredExhibitors] = useState<Exhibitor[]>([])

  useEffect(() => {
    //setExhibitors(exhibitorsList)
    //setFilteredExhibitors(exhibitors)
  }, [])

  if (loading) return <p>Loading exhibitors...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!exhibitors) return <p>No exhibitors available.</p>; // <- ensures non-null below

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>Companies at the Fair</Page.Header>

        <div className="p-6 space-y-6">
        {/* Filters */}
        {/* <ExhibitorFilters
            exhibitors={exhibitors}
            onChange={setFilteredExhibitors}
        /> */}

          {/* Exhibitor Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exhibitors.map((exhibitor: Exhibitor) => (
              <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
              ))}
{/* 
              {filteredExhibitors.length === 0 && (
              <p className="text-gray-500 col-span-full text-center">
                  No exhibitors match your filters.
              </p>
              )} */}
          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
