"use client"

import ExhibitorFilterItem from "@/app/student/exhibitors/_components/ExhibitorFilterItem"
import {
  Employment,
  Exhibitor,
  Industry,
  Program
} from "@/components/shared/hooks/api/useExhibitors"
import { Input } from "@/components/ui/input"
import { getLocaleFromPathname, type Locale } from "@/lib/i18n"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import { ExhibitorCard } from "./ExhibitorCard"
import { sortExhibitors, type ExhibitorSort } from "./exhibitorSort"

const exhibitorSearchText: Record<
  Locale,
  {
    searchPlaceholder: string
    filterEmployment: string
    filterIndustry: string
    filterProgram: string
  }
> = {
  en: {
    searchPlaceholder: "Search by company name",
    filterEmployment: "Filter by Employment",
    filterIndustry: "Filter by Industry",
    filterProgram: "Filter by Program"
  },
  sv: {
    searchPlaceholder: "Sök efter företagsnamn",
    filterEmployment: "Filtrera på anställningsform",
    filterIndustry: "Filtrera på bransch",
    filterProgram: "Filtrera på program"
  }
}

interface Props {
  exhibitors: Exhibitor[]
  employments: Employment[]
  industries: Industry[]
  programs: Program[]
}

export default function ExhibitorSearch({
  exhibitors,
  employments,
  industries,
  programs
}: Props) {
  const locale = getLocaleFromPathname(usePathname())
  const dict = exhibitorSearchText[locale]
  const [searchQueryName, setSearchQueryName] = useState("")
  const [sortBy, setSortBy] = useState<ExhibitorSort>("tier-gold")
  const [filteredExhibitors, setFilteredExhibitors] =
    useState<Exhibitor[]>(exhibitors)

  const sortedExhibitors = useMemo(
    () => sortExhibitors(filteredExhibitors, sortBy),
    [filteredExhibitors, sortBy]
  )

  return (
    <div className="space-y-4 py-6">
      <Input
        type="text"
        value={searchQueryName}
        onChange={e => setSearchQueryName(e.target.value)}
        placeholder={dict.searchPlaceholder}
        className="grow rounded-sm border p-2"
      />

      <ExhibitorFilterItem
        exhibitors={exhibitors}
        employments={employments}
        industries={industries}
        programs={programs}
        searchQueryName={searchQueryName}
        onFilterChange={setFilteredExhibitors}
        labels={dict}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="w-full">
        <div className="mx-auto grid max-w-300 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedExhibitors.map(exhibitor => (
            <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
          ))}
        </div>
      </div>
    </div>
  )
}
