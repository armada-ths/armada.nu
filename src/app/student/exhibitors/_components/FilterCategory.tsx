// FilterCategory.tsx

import React from 'react';

interface FilterCategoryProps {
    name: string;
}

export const FilterCategory: React.FC<FilterCategoryProps> = ({ name }) => {
    return (
        <div className="p-5 border-b border-gray-200 flex justify-between items-center cursor-pointer">
            <span className="text-sm font-medium tracking-wider text-gray-700">{name}</span>
            {/* Placeholder for an arrow or 'i' icon to indicate it's clickable */}
            <span className="text-gray-400">|</span>
        </div>
    );
};

// Note: Clicking this component would likely navigate to another view within the modal
// to select the actual sizes/brands/colors, or expand a list right there.