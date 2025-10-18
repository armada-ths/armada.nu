import { Exhibitor, useExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { useMemo, useState } from "react"

export interface Industry {
  id: number
  name: string
}

export function useFilteredExhibitors() {
  const { data: exhibitors, isLoading, isError, error, refetch } = useExhibitors()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustryIds, setSelectedIndustryIds] = useState<number[]>([])

  const filteredExhibitors = useMemo(() => {
    if (!exhibitors) return []
    return filterExhibitors(exhibitors, searchQuery, selectedIndustryIds)
  }, [exhibitors, searchQuery, selectedIndustryIds])

  return {
    exhibitors: filteredExhibitors,
    isLoading,
    isError,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    selectedIndustryIds,
    setSelectedIndustryIds,
  }
}

function filterExhibitors(
  exhibitors: Exhibitor[],
  searchQuery: string,
  selectedIndustryIds: number[]
): Exhibitor[] {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  return exhibitors.filter((ex) => {
    const matchesName =
      !normalizedQuery || ex.name.toLowerCase().includes(normalizedQuery)

    const matchesIndustry =
      selectedIndustryIds.length === 0 ||
      (Array.isArray(ex.industries) &&
        ex.industries.some((ind) => selectedIndustryIds.includes(ind.id)))

    return matchesName && matchesIndustry
  })
}
