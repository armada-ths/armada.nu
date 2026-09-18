import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"

export const EXHIBITOR_SORT_OPTIONS = [
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
  { value: "tier-gold", label: "Tier: Gold to Bronze" },
  { value: "tier-bronze", label: "Tier: Bronze to Gold" }
] as const

export type ExhibitorSort = (typeof EXHIBITOR_SORT_OPTIONS)[number]["value"]

export function isExhibitorSort(value: string): value is ExhibitorSort {
  return EXHIBITOR_SORT_OPTIONS.some(option => option.value === value)
}

const TIER_RANK = {
  Gold: 0,
  Silver: 1,
  Bronze: 2
} as const

function getTierRank(tier: Exhibitor["tier"]) {
  return TIER_RANK[tier as keyof typeof TIER_RANK] ?? Number.MAX_SAFE_INTEGER
}

export function sortExhibitors(exhibitors: Exhibitor[], sortBy: ExhibitorSort) {
  return exhibitors.toSorted((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "tier-gold":
        return getTierRank(a.tier) - getTierRank(b.tier)
      case "tier-bronze":
        return getTierRank(b.tier) - getTierRank(a.tier)
    }
  })
}
