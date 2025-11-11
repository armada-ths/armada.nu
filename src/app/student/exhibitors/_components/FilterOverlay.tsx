"use client";

import ExhibitorFilterItem from "@/app/student/exhibitors/_components/ExhibitorFilterItem";
import {
  Employment,
  Exhibitor,
  Industry,
  Program,
} from "@/components/shared/hooks/api/useExhibitors";
import { cn } from "@/lib/utils";
import React from "react";

interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  headerHeight?: string;
  exhibitors: Exhibitor[];
  employments: Employment[];
  industries: Industry[];
  programs: Program[];
  searchQueryName: string;
  onFilterChange?: (filtered: Exhibitor[]) => void;
}

export const FilterOverlay: React.FC<FilterOverlayProps> = ({
  isOpen,
  onClose,
  headerHeight = "4rem",
  exhibitors,
  employments,
  industries,
  programs,
  searchQueryName,
  onFilterChange,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* ✅ BACKDROP — fades in/out, only clickable when open */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />


      {/* ✅ PANEL — slides independently and clickable only when open */}
      <div
        className={cn(
          "absolute right-0 w-full h-full md:w-[420px] md:h-auto",
          "bg-background/95 backdrop-blur-lg sm:border-l flex flex-col shadow-xl",
          "transition-transform duration-300 ease-out pointer-events-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ top: headerHeight, bottom: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow overflow-y-auto pb-24">
          <div className="flex justify-center py-2 mt-2">
            <button
              className="w-[92%] bg-black text-white py-3 font-medium tracking-widest hover:bg-gray-800 rounded-md transition duration-150"
              onClick={onClose}
            >
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
  );
};

export default FilterOverlay;
