// FilterOverlay.tsx (Final Mobile-Optimized Revision)

import ExhibitorFilterItem from "@/app/student/exhibitors/_components/ExhibitorFilterItem";
import { Employment, Exhibitor, Industry, Program } from "@/components/shared/hooks/api/useExhibitors";
import React from 'react';


// (Interfaces and prop definitions remain the same)
interface FilterOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    filterCount?: number;
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
    filterCount = 54,
    headerHeight = '4rem',
    exhibitors, employments, industries, programs, searchQueryName, onFilterChange
}) => {
    // Translate classes for the slide-in/slide-out effect
    const overlayClasses = isOpen
        ? 'fixed inset-0 z-50 transform translate-x-0 transition-transform duration-300 ease-out'
        : 'fixed inset-0 z-50 transform translate-x-full transition-transform duration-300 ease-out pointer-events-none';
    return (
        <div className={overlayClasses}>
            {/* 1. Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
                aria-hidden={!isOpen}
            ></div>

            {/* 2. Modal Content (The white panel) */}
            <div
                className="absolute right-0 w-full h-full md:w-96 md:h-auto max-w-full bg-gradient-to-br shadow-xl flex flex-col"
                style={{
                    bottom: 0, // <-- Set the bottom position to 0
                    top: headerHeight,
                }}
            >


                {/* ... (Filter Categories - The main scrollable content area) ... */}
                <div className="flex-grow overflow-y-auto pb-24 ">

                    <div className="flex justify-center py-2">
                        <button
                            className="w-[92%] bg-black text-white py-3 font-medium tracking-widest hover:bg-gray-800 rounded-md transition duration-150"
                            onClick={onClose}
                        >
                            CLOSE FILTER
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

// ... (FilterCategory helper component) ...
const FilterCategory: React.FC<{ name: string }> = ({ name }) => (
    <div className="p-5 border-b border-gray-200 flex justify-between items-center cursor-pointer">
        <span className="text-sm font-medium tracking-wider text-gray-700">{name}</span>
        <span className="text-gray-400">|</span>
    </div>
);

export default FilterOverlay;