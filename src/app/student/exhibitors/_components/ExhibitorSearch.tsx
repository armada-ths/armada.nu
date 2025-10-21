"use client";

import FilterOverlay from "@/app/student/exhibitors/_components/FilterOverlay";

import { Employment, Exhibitor, Industry, Program } from "@/components/shared/hooks/api/useExhibitors";
import { useState } from "react";
import { ExhibitorCard } from "./ExhibitorCard";
// Import the MultiSelect component and the Option interface

interface Props {
  exhibitors: Exhibitor[];
  employments: Employment[];
  industries: Industry[];
  programs: Program[];
}

export default function ExhibitorSearch({ exhibitors, employments, industries, programs }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const [searchQueryName, setSearchQueryName] = useState("");
  const [filteredExhibitors, setFilteredExhibitors] = useState<Exhibitor[]>(exhibitors);



  return (
    <div className="py-6 space-y-4">

      <div className="py-2 flex flex-col sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
        <input
          type="text"
          value={searchQueryName}
          onChange={(e) => setSearchQueryName(e.target.value)}
          placeholder="Search by company name"
          className="border rounded p-2 flex-grow"
        />

        <button onClick={() => setModalOpen(true)} className="py-1">

          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <div className="flex items-center space-x-2 cursor-pointer">
              {/* Icon for filter (e.g., a hamburger or three horizontal lines) */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 10h18M3 16h18" />
              </svg>
              <span className="text-sm font-semibold tracking-widest">FILTER</span>
            </div>

            <div className="flex items-center space-x-4">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {/* You'd add the layout view toggle buttons here (the two squares) */}
            </div>
          </div>
        </button>

        <FilterOverlay isOpen={modalOpen} onClose={() => setModalOpen(false)}
          exhibitors={exhibitors}
          employments={employments}
          industries={industries}
          programs={programs}
          searchQueryName={searchQueryName}
          onFilterChange={setFilteredExhibitors}
        />
      </div >

      <div className="w-full">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-[1200px] mx-auto justify-center">
          {filteredExhibitors.map((exhibitor) => (
            <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
          ))}
        </div>
      </div>
    </div >
  );
}