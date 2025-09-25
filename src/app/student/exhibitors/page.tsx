"use client"

import { ExhibitorCard } from "@/app/student/exhibitors/_components/ExhibitorCard"
import ExhibitorFilters from "@/app/student/exhibitors/_components/ExhibitorFilters"
import { Employment, Exhibitor, Industry } from "@/components/shared/hooks/api/useExhibitors"
import { Page } from "@/components/shared/Page"
import { useEffect, useState } from "react"

// Example mock exhibitors (replace with API data or your `useExhibitors` hook)
const mockExhibitors: Exhibitor[] = [
  {
    id: 1,
    name: "Afry",
    type: "company",
    company_website: "https://afry.com/en",
    about: "Afry is an international engineering, design and advisory company.",
    industries: [{ id: 1, name: "Software" }],
    employments: [{ id: 1, name: "Internship" }],
    locations: [],
    groups: [],
    climate_compensation: false,
    flyer: "",
    booths: [],
    logo_squared: "/exhibitorLogo/afry.png",
    map_img: "/exhibitorMap/afry.jpeg",
    fair_location: "Nymble",
  },
  {
    id: 2,
    name: "Afry",
    type: "company",
    company_website: "https://afry.com/en",
    about: "Afry is an international engineering, design and advisory company.",
    industries: [{ id: 2, name: "Consulting" }],
    employments: [{ id: 2, name: "full-time" }],
    locations: [],
    groups: [],
    climate_compensation: false,
    flyer: "",
    booths: [],
    logo_squared: "/exhibitorLogo/afry.png",
    fair_location: "Nymble",
  },
]

const mockEmployemnts: Employment[] = [{ id: 1, name: "Software" }, { id: 2, name: "Consulting" }]
const mockIndustries: Industry[] = [{ id: 1, name: "Internship" }, { id: 2, name: "full-time" }]


export default function ExhibitorsPage() {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [filteredExhibitors, setFilteredExhibitors] = useState<Exhibitor[]>([])

  useEffect(() => {
    // In a real app, replace with API call or your useExhibitors hook
    setExhibitors(mockExhibitors)
    setFilteredExhibitors(mockExhibitors)
  }, [])

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>Companies at the Fair</Page.Header>

        <div className="p-6 space-y-6">
        {/* Filters */}
        <ExhibitorFilters
            exhibitors={exhibitors}
            onChange={setFilteredExhibitors}
        />

            {/* Exhibitor Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExhibitors.map((exhibitor: Exhibitor) => (
                <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
                ))}

                {filteredExhibitors.length === 0 && (
                <p className="text-gray-500 col-span-full text-center">
                    No exhibitors match your filters.
                </p>
                )}
            </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
