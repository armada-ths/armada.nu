"use client"

import { industryTypeList } from "@/app/student/map/lib/survey"
import { SelectionItem } from "@/app/student/map/survey/_components/SelectionItem"
import { useState } from "react"

export default function IndustryTypeSelection({
  industryTypeSelection,
  onIndustryTypeSelect
}: {
  industryTypeSelection: string[]
  onIndustryTypeSelect: (industryType: string) => void
}) {
  const [showAll, setShowAll] = useState(false)
  const initialVisibleCount = 5

  const handleLoadMoreClick = () => {
    setShowAll(prev => !prev)
  }
  const industryTypeItems = showAll
    ? industryTypeList
    : industryTypeList.slice(0, initialVisibleCount)

  return (
    <div className="flex flex-col justify-between">
      <div>
        <h2 className="m-4 text-left text-xl text-stone-200">Industries:</h2>
        <div className="m-4 mt-4 flex flex-wrap gap-4">
          {industryTypeItems.map(industryType => (
            <div className="" key={industryType}>
              <SelectionItem
                name={industryType}
                isSelected={industryTypeSelection.includes(industryType)}
                onClick={() => onIndustryTypeSelect(industryType)}
              />
            </div>
          ))}
          {/* Show "Load More" or "Show Less" based on the current state */}
          {industryTypeList.length > initialVisibleCount && (
            <button
              onClick={handleLoadMoreClick}
              className="hover:text-melon-500 text-xs text-melon-700 underline">
              {showAll ? "SHOW LESS" : "LOAD MORE"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
