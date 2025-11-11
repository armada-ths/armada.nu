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
                className="absolute right-0 w-full h-full md:w-96 md:h-auto max-w-full bg-white shadow-xl flex flex-col"
                style={{
                    bottom: 0, // <-- Set the bottom position to 0
                    top: headerHeight,
                }}
            >
                {/* 🔥 FIX: Header Section - Uses flexbox to correctly position the items */}
                <div className="p-5 border-b border-gray-200 flex justify-between items-center space-x-4">

                    <span className="text-lg font-semibold tracking-wider">
                        FILTER ({filterCount})
                    </span>

                    {/* Close button ('x' icon) - NO absolute positioning needed */}
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-gray-500 hover:text-black p-1 -mr-2" // -mr-2 pulls it slightly to the edge like the image
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ... (Filter Categories - The main scrollable content area) ... */}
                <div className="flex-grow overflow-y-auto pb-24">
                    <ExhibitorFilterItem
                        exhibitors={exhibitors}
                        employments={employments}
                        industries={industries}
                        programs={programs}
                        searchQueryName={searchQueryName}
                        onFilterChange={onFilterChange}
                    />
                </div>

                {/* ... (Footer Action Buttons - Anchored to the bottom of the screen) ... */}
                <div
                    className="p-4 border-t border-gray-200 bg-white absolute bottom-4rem w-full"
                >
                    <button
                        className="w-full bg-black text-white py-3 font-medium tracking-widest hover:bg-gray-800 transition duration-150"
                        onClick={onClose}
                    >
                        CLOSE
                    </button>
                    {/* <button
                        className="mt-3 text-sm font-medium tracking-widest text-gray-700 hover:text-black"
                        onClick={() => console.log('Clear All Filters')}
                    >
                        CLEAR ALL
                    </button> */}
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