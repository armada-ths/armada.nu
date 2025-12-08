import { Employment, Exhibitor, Industry, Program } from "@/components/shared/hooks/api/useExhibitors";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"; // Adjust path as needed
import { useEffect, useMemo, useState } from "react";

interface Props {
  exhibitors: Exhibitor[];
  employments: Employment[];
  industries: Industry[];
  programs: Program[];
  searchQueryName: string;
  onFilterChange?: (filtered: Exhibitor[]) => void;
}

export default function ExhibitorFilterItem({ exhibitors, employments, industries, programs, searchQueryName, onFilterChange }: Props) {
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


  useEffect(() => {
    onFilterChange?.(filtered);
  }, [filtered, onFilterChange]);

  return (
    <div className="p-4 space-y-2">
      {/* Employment Filter */}
      <MultiSelect
        options={employmentOptions}
        onValueChange={setSelectedEmploymentIds}
        placeholder="Filter by Employment"
        popoverClassName="
      w-(--radix-popover-trigger-width)
      min-w-full
      sm:w-(--radix-popover-trigger-width)
      max-w-[95vw]
      "
        className="w-full bg-licorice text-white!  hover:bg-gray-800!"
      />

      <MultiSelect
        options={industriesOptions}
        onValueChange={setSelectedIndustriesIds}
        placeholder="Filter by Industry"
        popoverClassName="
            w-(--radix-popover-trigger-width) 
            min-w-full 
            sm:w-(--radix-popover-trigger-width)
            max-w-[95vw]
          "
        className="w-full bg-licorice text-white!  hover:bg-gray-800!"
      />


      {/* Program Filter */}
      <MultiSelect
        options={programOptions}
        onValueChange={setSelectedProgramsIds}
        placeholder="Filter by Program"
        popoverClassName="
            w-(--radix-popover-trigger-width) 
            min-w-full
          "
        className="w-full bg-licorice text-white!  hover:bg-gray-800!"
      />
    </div>)
}
