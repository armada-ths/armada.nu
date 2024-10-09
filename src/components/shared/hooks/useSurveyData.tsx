"use client"

import { LOCAL_STORAGE_KEY, SurveyData } from "@/app/student/map/lib/survey"
import { useEffect, useState } from "react"

export function useSurveyData() {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null)

  useEffect(() => {
    const rawStoredData = localStorage.getItem(LOCAL_STORAGE_KEY)

    const storedData = rawStoredData
      ? (JSON.parse(rawStoredData) as SurveyData)
      : null
    setSurveyData(storedData)
  }, [])
  return surveyData
}
