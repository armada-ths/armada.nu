"use client"

import { industryTypeList } from "@/app/student/map/lib/survey"
import { SelectionItem } from "@/app/student/map/survey/_components/SelectionItem"

export default function IndustryTypeSelection({
  industryTypeSelection,
  onIndustryTypeSelect
}: {
  industryTypeSelection: string[]
  onIndustryTypeSelect: (industryType: string) => void
}) {
  return (
    <div className="flex flex-col justify-between">
      <div>
        <p className="m-4 text-left text-xl text-stone-200">
          Select your Industry type interest (optional):
        </p>
        <div className="m-4 mt-4 flex flex-wrap gap-4">
          {industryTypeList.map(industryType => (
            <div className="" key={industryType}>
              <SelectionItem
                name={industryType}
                isSelected={industryTypeSelection.includes(industryType)}
                onClick={() => onIndustryTypeSelect(industryType)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
