"use client";

import { Employment, Exhibitor, Industry, Program } from "@/components/shared/hooks/api/useExhibitors";
import Modal from "@/components/ui/Modal";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"; // Adjust path as needed
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ExhibitorCard } from "./ExhibitorCard";
import { FilterOverlay } from './FilterOverlay';
import { ProductListHeader } from './ProductListHeader';

interface Props {
  exhibitors: Exhibitor[];
  employments: Employment[];
  industries: Industry[];
  programs: Program[];
}

export default function ExhibitorSearch({ exhibitors, employments, industries, programs }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const handleFilterOpen = () => setIsFilterOpen(true);
  const handleFilterClose = () => setIsFilterOpen(false);
  const router = useRouter()

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

      <div className="py-2 flex flex-col sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
        <input
          type="text"
          value={searchQueryName}
          onChange={(e) => setSearchQueryName(e.target.value)}
          placeholder="Search by company name"
          className="border rounded p-2 flex-grow"
        />

        <ProductListHeader onFilterClick={handleFilterOpen} />

        <FilterOverlay
          isOpen={isFilterOpen}
          onClose={handleFilterClose}
          headerHeight={"100"}
        />

        <button onClick={() => setModalOpen(true)} className="py-1">
          <HamburgerMenuIcon width={30} height={30} />
        </button>

        <Modal
          open={modalOpen}
          setOpen={setModalOpen}
          className="max-w-[1000px] bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 p-0"
          onClose={() => router.push("/student/exhibitors", { scroll: false })}>
          <div className="p-4 sm:p-10 space-y-2 **max-h-[80vh] overflow-y-auto**">
            {/* Employment Filter */}
            <div className="w-full md:w-64">
              <MultiSelect
                options={employmentOptions}
                onValueChange={setSelectedEmploymentIds}
                placeholder="Filter by Employment"
              />
            </div>

            {/* Industries Filter */}
            <div className="w-full sm:w-64">
              <MultiSelect
                options={industriesOptions}
                onValueChange={setSelectedIndustriesIds}
                placeholder="Filter by Industry"
              />
            </div>

            {/* Program Filter */}
            <div className="w-full sm:w-64">
              <MultiSelect
                options={programOptions}
                onValueChange={setSelectedProgramsIds}
                placeholder="Filter by Program"
              />
            </div>
          </div>
        </Modal>
      </div >

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exhibitor) => (
          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
        ))}
      </div>
    </div >
  );
}