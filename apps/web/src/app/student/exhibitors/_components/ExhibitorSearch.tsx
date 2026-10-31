"use client"

import ExhibitorFilterItem from "@/app/student/exhibitors/_components/ExhibitorFilterItem"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useShuffledItems } from "@/components/shared/hooks/useShuffledItems"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import ExhibitorList from "./ExhibitorList"
import { sortExhibitors, type ExhibitorSort } from "./exhibitorSort"

interface Props {
  exhibitors: Exhibitor[]
}

const getExhibitorId = (exhibitor: Exhibitor) => exhibitor.id

export default function ExhibitorSearch({ exhibitors }: Props) {
  const shuffledExhibitors = useShuffledItems(exhibitors, getExhibitorId)
  const [searchQueryName, setSearchQueryName] = useState("")
  const [sortBy, setSortBy] = useState<ExhibitorSort>("tier-gold")
  const [filteredExhibitors, setFilteredExhibitors] = useState<Exhibitor[]>([])

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
        placeholder="Search by company name"
        className="grow rounded-sm border p-2"
      />

      {shuffledExhibitors && (
        <ExhibitorFilterItem
          exhibitors={shuffledExhibitors}
          searchQueryName={searchQueryName}
          onFilterChange={setFilteredExhibitors}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      <div className="w-full" aria-busy={shuffledExhibitors === null}>
        <ExhibitorList
          exhibitors={exhibitors}
          visibleExhibitors={sortedExhibitors}
        />
      </div>
    </div>
  )
}
