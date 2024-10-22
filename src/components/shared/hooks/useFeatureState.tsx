// Keep mapbox feature state in sync with component state

import { BoothID } from "@/app/student/map/lib/booths"
import { MutableRefObject, useEffect } from "react"
import { MapRef } from "react-map-gl/dist/esm/exports-maplibre"

// to allow for styling of the features
export function useFeatureState(
  mapRef: MutableRefObject<MapRef | null>,
  boothIds: BoothID[],
  stateKey: "active" | "hover" | "filtered"
) {
  useEffect(() => {
    const map = mapRef.current
    if (map == null || boothIds.length === 0) return

    for (const boothId of boothIds) {
      map.setFeatureState(
        { source: "booths", id: boothId },
        { [stateKey]: true }
      )
    }

    return () => {
      for (const boothId of boothIds) {
        map.setFeatureState(
          { source: "booths", id: boothId },
          { [stateKey]: false }
        )
      }
    }
  }, [boothIds, stateKey])
}
