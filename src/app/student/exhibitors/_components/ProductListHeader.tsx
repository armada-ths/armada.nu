// ProductListHeader.tsx

import React from 'react';

interface ProductListHeaderProps {
    onFilterClick: () => void;
}

export const ProductListHeader: React.FC<ProductListHeaderProps> = ({ onFilterClick }) => {
    return (
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={onFilterClick}>
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
    );
};

export default ProductListHeader;