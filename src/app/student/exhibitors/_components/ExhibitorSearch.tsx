"use client";

import { Employment, Exhibitor } from "@/components/shared/hooks/api/useExhibitors";
import { useMemo, useState } from "react";
import { ExhibitorCard } from "./ExhibitorCard";
// Import the MultiSelect component and the Option interface
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"; // Adjust path as needed

interface Props {
  exhibitors: Exhibitor[];
  employments: Employment[];
}

export default function ExhibitorSearch({ exhibitors, employments }: Props) {
  const [searchQueryName, setSearchQueryName] = useState("");

  // 1. STATE CHANGE: Hold an array of selected employment IDs as STRINGS
  const [selectedEmploymentIds, setSelectedEmploymentIds] = useState<string[]>([]);

  // 2. DATA TRANSFORMATION: Prepare the employments data for the MultiSelect component
  const employmentOptions: MultiSelectOption[] = useMemo(() => {
    return employments.map(employment => ({
      // value must be a string for the MultiSelect component
      value: String(employment.id),
      label: employment.name,
    }));
  }, [employments]);


  const filtered = useMemo(() => {
    let currentFilteredList = exhibitors;

    // Convert the selected string IDs back to numbers for filtering
    const selectedNumericIds = selectedEmploymentIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    // --- Name Filter ---
    if (searchQueryName) {
      const nameQuery = searchQueryName.toLowerCase().trim();
      currentFilteredList = currentFilteredList.filter((ex) =>
        ex.name.toLowerCase().includes(nameQuery)
      );
    }

    // --- Employment Filter ---
    if (selectedNumericIds.length > 0) {
      currentFilteredList = currentFilteredList.filter((ex) => {
        if (!ex.employments || ex.employments.length === 0) {
          return false;
        }

        // 3. FILTER LOGIC: Check exhibitor employments against the numeric array
        return ex.employments.some(exEmployment =>
          selectedNumericIds.includes(exEmployment.id)
        );
      });
    }

    return currentFilteredList
  }, [searchQueryName, selectedEmploymentIds, exhibitors]);

  return (
    <div className="py-6 space-y-4">

      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search Input for Name */}
        <input
          type="text"
          value={searchQueryName}
          onChange={(e) => setSearchQueryName(e.target.value)}
          placeholder="Search by company name..."
          className="border rounded p-2 w-full sm:w-1/2"
        />

        {/* Multi-Select Component Integration */}
        <div className="w-full sm:w-1/2">
          <MultiSelect
            options={employmentOptions}
            onValueChange={setSelectedEmploymentIds} // Pass the state setter
            placeholder="Filter by Employment Type"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exhibitor) => (
          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
        ))}
      </div>
    </div >
  );
}