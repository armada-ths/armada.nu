"use client"
import { useLocale } from "@armada/shared/i18n/client"
import { normalizeLocale } from "@armada/shared/i18n/routing"

import ExhibitorFilterItem from "@/app/[locale]/student/exhibitors/_components/ExhibitorFilterItem"
import {
  Employment,
  Exhibitor,
  Industry,
  Program
} from "@/components/shared/hooks/api/useExhibitors"
import { Input } from "@/components/ui/input"

import { useMemo, useState } from "react"
import { ExhibitorCard } from "./ExhibitorCard"
import { sortExhibitors, type ExhibitorSort } from "./exhibitorSort"

import { exhibitorSearchText } from "@/i18n/dictionaries"

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
  const locale = normalizeLocale(useLocale())
  const dict = exhibitorSearchText[locale]
  const [searchQueryName, setSearchQueryName] = useState("")
  const [sortBy, setSortBy] = useState<ExhibitorSort>("tier-gold")
  const [filteredExhibitors, setFilteredExhibitors] =
    useState<Exhibitor[]>(exhibitors)

  const sortedExhibitors = useMemo(
    () => sortExhibitors(filteredExhibitors, sortBy, locale),
    [filteredExhibitors, sortBy, locale]
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
