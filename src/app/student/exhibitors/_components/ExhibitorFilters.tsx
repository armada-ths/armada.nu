import MultiSelect from "@/app/student/_components/MultiSelect"
import {
  Filter,
  FilterItem,
  FilterKey,
  applyFilters,
  filterBySearch,
  makeFilter
} from "@/app/student/lib/filters"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { Input } from "@/components/ui/input"
import { useRef, useState } from "react"

export default function ExhibitorFilters({
  exhibitors,
  onChange
}: {
  exhibitors: Exhibitor[]
  onChange: (filtered: Exhibitor[]) => void
}) {
  const [searchText, setSearchText] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const [filters, setFilters] = useState<{ [K in FilterKey]: Filter }>({
    employments: makeFilter("employments", "Employments", exhibitors),
    industries: makeFilter("industries", "Industries", exhibitors)
  })

  function onFilterChange(filter: Filter, newSelection: FilterItem[]) {
    const newFilters = {
      ...filters,
      [filter.key]: { ...filter, selected: newSelection }
    }
    setFilters(newFilters)
    onChange(applyFilters(exhibitors, Object.values(newFilters))) // do filtering and notify the parent
  }

  function onSearchChange(text: string) {
    setSearchText(text)
    if (text.trim() !== "") onChange(filterBySearch(exhibitors, text))
    else onChange(applyFilters(exhibitors, Object.values(filters))) // apply filters again when input is cleared
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        searchIcon={true}
        ref={inputRef}
        type="text"
        placeholder="Search all"
        className="w-full xs:w-[200px]"
        value={searchText}
        onChange={e => onSearchChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && inputRef.current?.blur()}
      />
      {Object.values(filters).map(f => (
        <MultiSelect
          key={f.key}
          filter={f}
          onChange={selected => onFilterChange(f, selected)}></MultiSelect>
      ))}
    </div>
  )
}
