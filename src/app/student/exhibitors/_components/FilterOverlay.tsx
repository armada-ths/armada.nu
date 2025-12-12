"use client"

import ExhibitorFilterItem from "@/app/student/exhibitors/_components/ExhibitorFilterItem"
import {
  Employment,
  Exhibitor,
  Industry,
  Program
} from "@/components/shared/hooks/api/useExhibitors"
import { cn } from "@/lib/utils"
import React from "react"

interface FilterOverlayProps {
  isOpen: boolean
  onClose: () => void
  headerHeight?: string
  exhibitors: Exhibitor[]
  employments: Employment[]
  industries: Industry[]
  programs: Program[]
  searchQueryName: string
  onFilterChange?: (filtered: Exhibitor[]) => void
}

export const FilterOverlay: React.FC<FilterOverlayProps> = ({
  isOpen,
  onClose,
  headerHeight = "0",
  exhibitors,
  employments,
  industries,
  programs,
  searchQueryName,
  onFilterChange
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* ✅ BACKDROP — fades in/out, only clickable when open */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* ✅ PANEL — slides independently and clickable only when open */}
      <div
        className={cn(
          "absolute right-0 h-full w-full md:h-auto md:w-[420px]",
          "bg-background/95 flex flex-col shadow-xl backdrop-blur-lg sm:border-l",
          "pointer-events-auto transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ top: headerHeight, bottom: 0 }}
        onClick={e => e.stopPropagation()}>
        <div className="grow overflow-y-auto pb-24">
          <div className="mt-2 flex justify-center py-2">
            <button
              className="bg-licorice w-[92%] rounded-md border border-white py-3 font-medium tracking-widest text-white transition duration-150 hover:bg-gray-800"
              onClick={onClose}>
              CLOSE
            </button>
          </div>

          <ExhibitorFilterItem
            exhibitors={exhibitors}
            employments={employments}
            industries={industries}
            programs={programs}
            searchQueryName={searchQueryName}
            onFilterChange={onFilterChange}
          />
        </div>
      </div>
    </div>
  )
}

export default FilterOverlay
