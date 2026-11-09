"use client"
import { useDraftState, useLocale } from "@armada/shared/i18n/client"
import {
  localizedText,
  normalizeLocale,
  type Locale
} from "@armada/shared/i18n/routing"
import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"
import { ChevronDown, ListFilter } from "lucide-react"
import { useEffect, useId, useMemo, useState } from "react"
import ExhibitorSortMenu from "./ExhibitorSortMenu"
import type { ExhibitorSort } from "./exhibitorSort"

const filterTriggerClassName =
  "bg-melon border-licorice text-licorice! hover:bg-melon w-full border-2 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none data-[state=open]:translate-x-0 data-[state=open]:translate-y-0 data-[state=open]:shadow-shadow data-[state=open]:hover:translate-x-0 data-[state=open]:hover:translate-y-0"

const filterPopoverClassName =
  "max-h-[min(60dvh,var(--radix-popover-content-available-height))]! w-(--radix-popover-trigger-width) max-w-[95vw]"

function categoryOptions(
  categories: { id: number; name: string; nameSv?: string | null }[],
  locale: Locale
): MultiSelectOption[] {
  const unique = new Map(categories.map(category => [category.id, category]))
  return Array.from(unique.values(), category => ({
    value: String(category.id),
    label: localizedText(locale, category.name, category.nameSv)
  })).sort((a, b) => a.label.localeCompare(b.label, locale))
}

interface Props {
  exhibitors: Exhibitor[]
  searchQueryName: string
  onFilterChange?: (filtered: Exhibitor[]) => void
  labels: {
    filters: string
    filterEmployment: string
    filterIndustry: string
    filterProgram: string
  }
  sortBy?: ExhibitorSort
  onSortChange?: (sortBy: ExhibitorSort) => void
}

export default function ExhibitorFilterItem({
  exhibitors,
  searchQueryName,
  onFilterChange,
  labels,
  sortBy = "tier-gold",
  onSortChange
}: Props) {
  const locale = normalizeLocale(useLocale())
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtersId = useId()
  // 1. STATE CHANGE: Hold an array of selected employment IDs as STRINGS
  const [selectedEmploymentIds, setSelectedEmploymentIds] = useDraftState<
    string[]
  >("employment", [])
  const [selectedIndustriesIds, setSelectedIndustriesIds] = useDraftState<
    string[]
  >("industry", [])
  const [selectedProgramsIds, setSelectedProgramsIds] = useDraftState<string[]>(
    "program",
    []
  )

  // Use the current exhibitor relationships, not historical standalone taxonomy rows.
  const employmentOptions = useMemo(
    () =>
      categoryOptions(
        exhibitors.flatMap(exhibitor => exhibitor.employments ?? []),
        locale
      ),
    [exhibitors, locale]
  )
  const industriesOptions = useMemo(
    () =>
      categoryOptions(
        exhibitors.flatMap(exhibitor => exhibitor.industries ?? []),
        locale
      ),
    [exhibitors, locale]
  )
  const programOptions = useMemo(
    () =>
      categoryOptions(
        exhibitors.flatMap(exhibitor => exhibitor.programs ?? []),
        locale
      ),
    [exhibitors, locale]
  )

  const filtered = useMemo(() => {
    let currentFilteredList = exhibitors

    // Convert the selected string IDs back to numbers for filtering
    const selectedEmploymentsNumericIds = selectedEmploymentIds
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
    const selectedIndustriesNumericIds = selectedIndustriesIds
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
    const selectedProgramsNumericIds = selectedProgramsIds
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))

    // --- Name Filter ---
    if (searchQueryName) {
      const nameQuery = searchQueryName.toLowerCase().trim()
      currentFilteredList = currentFilteredList.filter(ex =>
        ex.name.toLowerCase().includes(nameQuery)
      )
    }

    // --- Employment Filter ---
    if (selectedEmploymentsNumericIds.length > 0) {
      currentFilteredList = currentFilteredList.filter(ex => {
        if (!ex.employments || ex.employments.length === 0) {
          return false
        }

        // 3. FILTER LOGIC: Check exhibitor employments against the numeric array
        return ex.employments.some(exEmployment =>
          selectedEmploymentsNumericIds.includes(exEmployment.id)
        )
      })
    }

    // --- Industry Filter ---
    if (selectedIndustriesNumericIds.length > 0) {
      currentFilteredList = currentFilteredList.filter(ex => {
        if (!ex.industries || ex.industries.length === 0) {
          return false
        }

        // 3. FILTER LOGIC: Check exhibitor employments against the numeric array
        return ex.industries.some(exIndustry =>
          selectedIndustriesNumericIds.includes(exIndustry.id)
        )
      })
    }

    // --- Program Filter ---
    if (selectedProgramsNumericIds.length > 0) {
      currentFilteredList = currentFilteredList.filter(ex => {
        if (!ex.programs || ex.programs.length === 0) {
          return false
        }

        // 3. FILTER LOGIC: Check exhibitor employments against the numeric array
        return ex.programs.some(exProgram =>
          selectedProgramsNumericIds.includes(exProgram.id)
        )
      })
    }
    return currentFilteredList
  }, [
    searchQueryName,
    selectedEmploymentIds,
    selectedIndustriesIds,
    selectedProgramsIds,
    exhibitors
  ])

  useEffect(() => {
    onFilterChange?.(filtered)
  }, [filtered, onFilterChange])

  return (
    <div className="border-licorice border-t pt-4 pb-2">
      <Button
        type="button"
        variant="neutral"
        className="group sm:hidden"
        aria-expanded={filtersOpen}
        aria-controls={filtersId}
        onClick={() => setFiltersOpen(open => !open)}>
        <ListFilter aria-hidden="true" />
        {labels.filters}
        <ChevronDown
          aria-hidden="true"
          className="group-aria-expanded:rotate-180"
        />
      </Button>

      <div
        id={filtersId}
        className={cn(
          "flex-col gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-end",
          filtersOpen ? "mt-3 flex sm:mt-0" : "hidden"
        )}>
        <div className="min-w-0 flex-1 sm:min-w-48">
          <ExhibitorSortMenu
            value={sortBy}
            onValueChange={onSortChange}
            triggerClassName={filterTriggerClassName}
          />
        </div>
        {/* Employment Filter */}
        <div className="min-w-0 flex-1 sm:min-w-48">
          <MultiSelect
            options={employmentOptions}
            defaultValue={selectedEmploymentIds}
            onValueChange={setSelectedEmploymentIds}
            placeholder={labels.filterEmployment}
            popoverClassName={filterPopoverClassName}
            className={filterTriggerClassName}
          />
        </div>

        {/* Industries Filter */}
        <div className="min-w-0 flex-1 sm:min-w-48">
          <MultiSelect
            options={industriesOptions}
            defaultValue={selectedIndustriesIds}
            onValueChange={setSelectedIndustriesIds}
            placeholder={labels.filterIndustry}
            popoverClassName={filterPopoverClassName}
            className={filterTriggerClassName}
          />
        </div>

        {/* Program Filter */}
        <div className="min-w-0 flex-1 sm:min-w-48">
          <MultiSelect
            options={programOptions}
            defaultValue={selectedProgramsIds}
            onValueChange={setSelectedProgramsIds}
            placeholder={labels.filterProgram}
            popoverClassName={filterPopoverClassName}
            className={filterTriggerClassName}
          />
        </div>
      </div>
    </div>
  )
}
