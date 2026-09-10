"use client"

import ExhibitorFilterItem from "@/app/student/exhibitors/_components/ExhibitorFilterItem"
import {
  Employment,
  Exhibitor,
  Industry,
  Program
} from "@/components/shared/hooks/api/useExhibitors"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ExhibitorCard } from "./ExhibitorCard"

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
  const [searchQueryName, setSearchQueryName] = useState("")
  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" | "tier-gold" | "tier-bronze"
  >("tier-gold")
  const [filteredExhibitors, setFilteredExhibitors] =
    useState<Exhibitor[]>(exhibitors)

  const sortedExhibitors = [...filteredExhibitors].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "tier-gold": {
        const tierOrder = { Gold: 0, Silver: 1, Bronze: 2 }
        const tierA = tierOrder[a.tier as keyof typeof tierOrder] ?? 999
        const tierB = tierOrder[b.tier as keyof typeof tierOrder] ?? 999
        return tierA - tierB
      }
      case "tier-bronze": {
        const tierOrder = { Bronze: 0, Silver: 1, Gold: 2 }
        const tierA = tierOrder[a.tier as keyof typeof tierOrder] ?? 999
        const tierB = tierOrder[b.tier as keyof typeof tierOrder] ?? 999
        return tierA - tierB
      }
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4 py-6">
      <Input
        type="text"
        value={searchQueryName}
        onChange={e => setSearchQueryName(e.target.value)}
        placeholder="Search by company name"
        className="grow rounded-sm border p-2"
      />

      <ExhibitorFilterItem
        exhibitors={exhibitors}
        employments={employments}
        industries={industries}
        programs={programs}
        searchQueryName={searchQueryName}
        onFilterChange={setFilteredExhibitors}
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
