"use client"

import LocationSelect from "@/app/student/map/_components/LocationSelect"
import { MapComponent } from "@/app/student/map/_components/MapComponent"
import { QuestionnaireForm } from "@/app/student/map/_components/QuestionnaireForm"
import Sidebar from "@/app/student/map/_components/Sidebar"
import EditorMapComponent from "@/app/student/map/editor/EditorMapComponent"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import { useSurveyData } from "@/components/shared/hooks/useSurveyData"
import Modal from "@/components/shared/Modal"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Booth, BoothID, BoothMap } from "../lib/booths"
import {
  defaultLocation,
  LocationId,
  locations,
  validLocationId
} from "../lib/locations"

export default function MainView({
  boothsByLocation,
  boothsById,
  exhibitorsById
}: {
  boothsByLocation: Map<LocationId, BoothMap>
  boothsById: BoothMap
  exhibitorsById: Map<number, Exhibitor>
}) {
  // url: /student/map?floor=[nymble/1|nymble/2|nymble/3|library]&lat=[number]&lng=[number]&zoom=[number]
  // if floor is not provided or is invalid, default to nymble/1
  // if lat, lng or zoom is not provided, default to location center

  const searchParams = useSearchParams()
  const { width } = useScreenSize()
  const router = useRouter()
  const surveyData = useSurveyData()

  const floorUrlString = searchParams.get("floor") ?? "nymble/1"
  const [locationId, setLocationId] = useState<LocationId>(
    validLocationId(floorUrlString) ? floorUrlString : defaultLocation.id
  )
  const location = locations.find(loc => loc.id === locationId)!
  const currentLocationBoothsById = boothsByLocation.get(locationId)!

  const latitude =
    parseFloat(searchParams.get("lat") ?? "") || location.center.latitude
  const longitude =
    parseFloat(searchParams.get("lng") ?? "") || location.center.longitude
  const zoom =
    parseFloat(searchParams.get("zoom") ?? "") || location.center.zoom

  const initialView = { latitude, longitude, zoom }

  const [activeBoothId, setActiveBoothId] = useState<BoothID | null>(null)
  const [hoveredBoothId, setHoveredBoothId] = useState<BoothID | null>(null)
  const [filteredBooths, setFilteredBooths] = useState<Booth[]>(
    Array.from(boothsById.values())
  )
  const [openSurvey, setOpenSurvey] = useState(false)
  const [editorMode, setEditorMode] = useState(false)

  useEffect(() => {
    setOpenSurvey(!surveyData)
  }, [surveyData])

  useEffect(() => {
    // A new survey page for filter when using mobile
    if (openSurvey && width && width < 768) {
      router.push("/student/map/survey")
    }
  }, [width])

  return (
    <div className="relative flex h-full w-full">
      {!editorMode ? (
        <>
          <Sidebar
            boothsById={boothsById}
            activeBoothId={activeBoothId}
            hoveredBoothId={hoveredBoothId}
            setActiveBoothId={setActiveBoothId}
            setHoveredBoothId={setHoveredBoothId}
            currentLocation={locationId}
            filteredBooths={filteredBooths}
            setFilteredBooths={setFilteredBooths}
          />
          <div className="flex-grow">
            <MapComponent
              initialView={initialView}
              boothsById={currentLocationBoothsById}
              location={location}
              activeBoothId={activeBoothId}
              hoveredBoothId={hoveredBoothId}
              setActiveBoothId={setActiveBoothId}
              setHoveredBoothId={setHoveredBoothId}
              filteredBoothIds={filteredBooths.map(booth => booth.id)}
            />
          </div>
        </>
      ) : (
        <EditorMapComponent
          location={location}
          exhibitorsById={exhibitorsById}
        />
      )}

      {process.env.NODE_ENV === "development" && ( // toggle for editor mode, only visible in dev
        <Button
          className="absolute bottom-2 left-2"
          onClick={() => setEditorMode(prev => !prev)}>
          {editorMode ? "Switch to normal mode" : "Switch to edit mode"}
        </Button>
      )}

      {/* Questions Modal for filter when using PC*/}
      <Modal
        open={openSurvey}
        setOpen={setOpenSurvey}
        className="max-w-[780px] bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 p-0">
        <QuestionnaireForm onClose={() => setOpenSurvey(false)} />
      </Modal>

      <LocationSelect
        locationId={locationId}
        setLocationId={setLocationId}
        setActiveBoothId={setActiveBoothId}
      />
    </div>
  )
}
