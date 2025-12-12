"use client"

import FilterOverlay from "@/app/student/exhibitors/_components/FilterOverlay"

import {
  Employment,
  Exhibitor,
  Industry,
  Program
} from "@/components/shared/hooks/api/useExhibitors"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ExhibitorCard } from "./ExhibitorCard"
// Import the MultiSelect component and the Option interface

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
  const [modalOpen, setModalOpen] = useState(false)

  const [searchQueryName, setSearchQueryName] = useState("")
  const [filteredExhibitors, setFilteredExhibitors] =
    useState<Exhibitor[]>(exhibitors)

  return (
    <div className="space-y-4 py-6">
      <div className="flex flex-col py-2 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
        <Input
          type="text"
          value={searchQueryName}
          onChange={e => setSearchQueryName(e.target.value)}
          placeholder="Search by company name"
          className="grow rounded-sm border p-2"
        />

        <button onClick={() => setModalOpen(true)} className="py-1">
          <div className="border-licorice flex items-center justify-between border-b py-1">
            <div className="flex cursor-pointer items-center space-x-2">
              {/* Icon for filter (e.g., a hamburger or three horizontal lines) */}
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M3 10h18M3 16h18"
                />
              </svg>
              <span className="text-sm font-semibold tracking-widest">
                FILTER
              </span>
            </div>
          </div>
        </button>

        <FilterOverlay
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          exhibitors={exhibitors}
          employments={employments}
          industries={industries}
          programs={programs}
          searchQueryName={searchQueryName}
          onFilterChange={setFilteredExhibitors}
        />
      </div>

      <div className="w-full">
        <div className="mx-auto grid max-w-[1200px] justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExhibitors.map(exhibitor => (
            <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
          ))}
        </div>
      </div>
    </div>
  )
}
