"use client"

import { LOCAL_STORAGE_KEY } from "@/app/student/map/lib/survey"
import IndustryTypeSelection from "@/app/student/map/survey/_components/IndustryTypeSelection"
import JobTypeSelection from "@/app/student/map/survey/_components/JobTypeSelection"
import ProgrammeSelection from "@/app/student/map/survey/_components/ProgrammeSelection"
import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import { useSurveyData } from "@/components/shared/hooks/useSurveyData"
import { Page } from "@/components/shared/Page"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function QuestionnaireForm({ onClose }: { onClose?: () => void }) {
  const router = useRouter()

  const { width } = useScreenSize()

  const surveyData = useSurveyData()

  const [programme, setProgramme] = useState(surveyData?.Programme ?? "")
  const [jobTypeSelection, setJobTypeSelection] = useState(
    surveyData?.JobType ?? []
  )
  const [industryTypeSelection, setIndustryTypeSelection] = useState(
    surveyData?.IndustryType ?? []
  )

  const onProgrammeSelectChange = (programme: string) => {
    setProgramme(programme)
  }

  const onJobTypeSelect = (jobType: string) => {
    setJobTypeSelection(prev => {
      if (prev.includes(jobType)) {
        return prev.filter(item => item !== jobType)
      } else {
        return [...prev, jobType]
      }
    })
  }

  const onIndustryTypeSelect = (industryType: string) => {
    setIndustryTypeSelection(prev => {
      if (prev.includes(industryType)) {
        return prev.filter(item => item !== industryType)
      } else {
        return [...prev, industryType]
      }
    })
  }

  const onSubmit = () => {
    const surveyDataToSave = {
      Programme: programme,
      JobType: jobTypeSelection,
      IndustryType: industryTypeSelection
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(surveyDataToSave))
    if (onClose) {
      onClose()
    }
    router.push("/student/map")
  }

  useEffect(() => {
    if (width && width > 768) {
      router.push("/student/map")
    }
  }, [width])

  useEffect(() => {
    if (surveyData) {
      setProgramme(surveyData.Programme)
      setJobTypeSelection(surveyData?.JobType ?? [])
      setIndustryTypeSelection(surveyData.IndustryType ?? [])
    }
  }, [surveyData])

  return (
    <div className="mx-auto max-w-[560px] p-6">
      <Page.Header className="mb-4 text-center">PREFERENCES</Page.Header>
      <div className="h-[1px] w-full bg-stone-400"></div>

      <div>
        <ProgrammeSelection
          programme={programme}
          onProgrammeSelectChange={onProgrammeSelectChange}
        />
        <JobTypeSelection
          jobTypeSelection={jobTypeSelection}
          onJobTypeSelect={onJobTypeSelect}
        />
        <IndustryTypeSelection
          industryTypeSelection={industryTypeSelection}
          onIndustryTypeSelect={onIndustryTypeSelect}
        />
      </div>

      <div
        className="m-4 flex justify-between transition-transform duration-300
        ">
        <ArrowLeft
          size={42}
          className="cursor-pointer rounded-lg border border-white p-2"
        />
        <Button onClick={onSubmit}>Next</Button>
      </div>
    </div>
  )
}
