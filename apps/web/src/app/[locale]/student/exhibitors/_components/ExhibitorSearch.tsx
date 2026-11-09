"use client"
import { useDraftState, useLocale } from "@armada/shared/i18n/client"
import { normalizeLocale } from "@armada/shared/i18n/routing"
import { exhibitorSearchText } from "@/i18n/dictionaries"

import ExhibitorFilterItem from "@/app/[locale]/student/exhibitors/_components/ExhibitorFilterItem"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useShuffledItems } from "@/components/shared/hooks/useShuffledItems"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import ExhibitorList from "./ExhibitorList"
import { sortExhibitors, type ExhibitorSort } from "./exhibitorSort"

interface Props {
  exhibitors: Exhibitor[]
  mapEnabled?: boolean
}

const getExhibitorId = (exhibitor: Exhibitor) => exhibitor.id

export default function ExhibitorSearch({ exhibitors, mapEnabled }: Props) {
  const locale = normalizeLocale(useLocale())
  const dict = exhibitorSearchText[locale]
  const shuffledExhibitors = useShuffledItems(exhibitors, getExhibitorId)
  const [searchQueryName, setSearchQueryName] = useDraftState("search", "")
  const [sortBy, setSortBy] = useDraftState<ExhibitorSort>("sort", "tier-gold")
  const [filteredExhibitors, setFilteredExhibitors] = useState<Exhibitor[]>([])

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

      {shuffledExhibitors && (
        <ExhibitorFilterItem
          exhibitors={shuffledExhibitors}
          searchQueryName={searchQueryName}
          onFilterChange={setFilteredExhibitors}
          labels={dict}
          mapEnabled={mapEnabled}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      <div className="w-full" aria-busy={shuffledExhibitors === null}>
        <ExhibitorList
          exhibitors={exhibitors}
          visibleExhibitors={sortedExhibitors}
          mapEnabled={mapEnabled}
        />
      </div>
    </div>
  )
}
