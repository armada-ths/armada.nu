"use client"

import {
  geoJsonNymblePlan2Data,
  geoJsonNymblePlan2RoutesData,
  geoJsonNymblePlan3Data,
  geoJsonNymblePlan3RoutesData
} from "@/app/student/map/lib/config"
import { Location } from "@/app/student/map/lib/locations"
import { useEffect, useState } from "react"

//Change layer style data source based on selected location
export function useGeoJsonPlanData(location: Location) {
  const [geoJsonPlanData, setGeoJsonPlanData] = useState(geoJsonNymblePlan2Data)
  const [geoJsonNymblePlanRoutesData, setGeoJsonNymblePlanRoutesData] =
    useState(geoJsonNymblePlan2RoutesData)

  useEffect(() => {
    switch (location.id) {
      case "nymble/2": {
        setGeoJsonPlanData(geoJsonNymblePlan2Data)
        setGeoJsonNymblePlanRoutesData(geoJsonNymblePlan2RoutesData)
        break
      }
      case "nymble/3": {
        setGeoJsonPlanData(geoJsonNymblePlan3Data)
        setGeoJsonNymblePlanRoutesData(geoJsonNymblePlan3RoutesData)
        break
      }
      case "library":
        //TODO: library plan data
        break
    }
  }, [location])
  return [geoJsonPlanData, geoJsonNymblePlanRoutesData]
}
