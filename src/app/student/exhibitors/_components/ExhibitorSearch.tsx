"use client";

import ExhibitorFilterItem from "@/app/student/exhibitors/_components/ExhibitorFilterItem";
import { Employment, Exhibitor, Industry, Program } from "@/components/shared/hooks/api/useExhibitors";
import Modal from "@/components/ui/Modal";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
          <ExhibitorFilterItem
            exhibitors={exhibitors}
            employments={employments}
            industries={industries}
            programs={programs}
            searchQueryName={searchQueryName}
            onFilterChange={setFilteredExhibitors}
          />
        </Modal>
      </div >

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExhibitors.map((exhibitor) => (
          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
        ))}
      </div>
    </div >
  );
}