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
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function QuestionnaireForm({ onClose }: { onClose?: () => void }) {
  const router = useRouter()

  const { width } = useScreenSize()

  const { surveyData } = useSurveyData()

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
    <div className="mb-10 max-w-[560px] xs:mx-auto xs:mt-6">
      <Page.Header className="text-center">PREFERENCES</Page.Header>

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
        className={`${width && width < 768 ? "fixed bottom-0 z-50 mb-0 h-16 w-full bg-gradient-to-b from-stone-900 to-stone-950/40 px-5 filter backdrop-blur-lg" : "mb-4"} left-0 flex items-center justify-between `}>
        <Link
          className="hover:text-melon-500 flex items-center justify-center rounded-3xl text-center text-sm text-melon-700"
          href={"/"}>
          <ArrowLeft size={18}></ArrowLeft>
          Back to Homepage
        </Link>
        <Button onClick={onSubmit} className="px-7">
          Generate
        </Button>
      </div>
    </div>
  )
}
