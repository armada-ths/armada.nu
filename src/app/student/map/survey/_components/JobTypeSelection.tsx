"use client"

import { jobTypeList } from "@/app/student/map/lib/survey"
import { SelectionItem } from "@/app/student/map/survey/_components/SelectionItem"

export default function JobTypeSelection({
  jobTypeSelection,
  onJobTypeSelect
}: {
  jobTypeSelection: string[]
  onJobTypeSelect: (jobType: string) => void
}) {
  return (
    <div className="flex flex-col justify-between">
      <div>
        <p className="m-4 text-left text-xl text-stone-200">
          Select your job type interest (optional):
        </p>
        <div className="m-4 mt-4 flex flex-wrap gap-4">
          {jobTypeList.map(jobType => (
            <div key={jobType}>
              <SelectionItem
                name={jobType}
                isSelected={jobTypeSelection.includes(jobType)}
                onClick={() => onJobTypeSelect(jobType)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
