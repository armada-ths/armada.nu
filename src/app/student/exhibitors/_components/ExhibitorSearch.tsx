"use client";

import { Employment, Exhibitor, Industry, Program } from "@/components/shared/hooks/api/useExhibitors";
import { useMemo, useState } from "react";
import { ExhibitorCard } from "./ExhibitorCard";
// Import the MultiSelect component and the Option interface
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"; // Adjust path as needed

interface Props {
  exhibitors: Exhibitor[];
  employments: Employment[];
  industries: Industry[];
  programs: Program[];
}

export default function ExhibitorSearch({ exhibitors, employments, industries, programs }: Props) {
  const [searchQueryName, setSearchQueryName] = useState("");

  // 1. STATE CHANGE: Hold an array of selected employment IDs as STRINGS
  const [selectedEmploymentIds, setSelectedEmploymentIds] = useState<string[]>([]);
  const [selectedIndustriesIds, setSelectedIndustriesIds] = useState<string[]>([]);
  const [selectedProgramsIds, setSelectedProgramsIds] = useState<string[]>([]);

  // 2. DATA TRANSFORMATION: Prepare the employments data for the MultiSelect component
  const employmentOptions: MultiSelectOption[] = useMemo(() => {
    return employments.map(employment => ({
      // value must be a string for the MultiSelect component
      value: String(employment.id),
      label: employment.name,
    }));
  }, [employments]);

  const industriesOptions: MultiSelectOption[] = useMemo(() => {
    return industries.map(industry => ({
      value: String(industry.id),
      label: industry.name,
    }));
  }, [industries]);

  const programOptions: MultiSelectOption[] = useMemo(() => {
    return programs.map(program => ({
      value: String(program.id),
      label: program.name,
    }));
  }, [industries]);

  const filtered = useMemo(() => {
    let currentFilteredList = exhibitors;

    // Convert the selected string IDs back to numbers for filtering
    const selectedEmploymentsNumericIds = selectedEmploymentIds.map(id => parseInt(id)).filter(id => !isNaN(id));
    const selectedIndustriesNumericIds = selectedIndustriesIds.map(id => parseInt(id)).filter(id => !isNaN(id));
    const selectedProgramsNumericIds = selectedProgramsIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    // --- Name Filter ---
    if (searchQueryName) {
      const nameQuery = searchQueryName.toLowerCase().trim();
      currentFilteredList = currentFilteredList.filter((ex) =>
        ex.name.toLowerCase().includes(nameQuery)
      );
    }

    // --- Employment Filter ---
    if (selectedEmploymentsNumericIds.length > 0) {
      currentFilteredList = currentFilteredList.filter((ex) => {
        if (!ex.employments || ex.employments.length === 0) {
          return false;
        }

        // 3. FILTER LOGIC: Check exhibitor employments against the numeric array
        return ex.employments.some(exEmployment =>
          selectedEmploymentsNumericIds.includes(exEmployment.id)
        );
      });
    }

    // --- Industry Filter ---
    if (selectedIndustriesNumericIds.length > 0) {
      currentFilteredList = currentFilteredList.filter((ex) => {
        if (!ex.industries || ex.industries.length === 0) {
          return false;
        }

        // 3. FILTER LOGIC: Check exhibitor employments against the numeric array
        return ex.industries.some(exIndustry =>
          selectedIndustriesNumericIds.includes(exIndustry.id)
        );
      });
    }

    // --- Program Filter ---
    if (selectedProgramsNumericIds.length > 0) {
      currentFilteredList = currentFilteredList.filter((ex) => {
        if (!ex.programs || ex.programs.length === 0) {
          return false;
        }

        // 3. FILTER LOGIC: Check exhibitor employments against the numeric array
        return ex.programs.some(exProgram =>
          selectedProgramsNumericIds.includes(exProgram.id)
        );
      });
    }
    return currentFilteredList
  }, [searchQueryName, selectedEmploymentIds, selectedIndustriesIds, selectedProgramsIds, exhibitors]);

  return (
    <div className="py-6 space-y-4">

      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
        <input
          type="text"
          value={searchQueryName}
          onChange={(e) => setSearchQueryName(e.target.value)}
          placeholder="Search by company name..."
          className="border rounded p-2 flex-grow"
        />

        {/* Multi-Select Employment Filter */}
        <div className="sm:w-64 truncate">
          <MultiSelect
            options={employmentOptions}
            onValueChange={setSelectedEmploymentIds} // Pass the state setter
            placeholder="Filter by Employment Type"
          />
        </div>
        {/* Multi-Select Industries Filter */}
        <div className="sm:w-64 truncate">
          <MultiSelect
            options={industriesOptions}
            onValueChange={setSelectedIndustriesIds} // Pass the state setter
            placeholder="Filter by Industry Type"
          />
        </div>
        {/* Multi-Select Program Filter */}
        <div className="sm:w-64 truncate">
          <MultiSelect
            options={programOptions}
            onValueChange={setSelectedProgramsIds} // Pass the state setter
            placeholder="Filter by Program"
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