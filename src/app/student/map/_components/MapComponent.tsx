import { BoothPopup } from "@/app/student/map/_components/BoothPopup"
import {
  BoothID,
  geoJsonBoothDataByLocation
} from "@/app/student/map/lib/booths"
import { Location } from "@/app/student/map/lib/locations"
import { useFeatureState } from "@/components/shared/hooks/useFeatureState"
import "maplibre-gl/dist/maplibre-gl.css"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  Layer,
  MapLayerMouseEvent,
  MapRef,
  Map as MapboxMap,
  Source
} from "react-map-gl/maplibre"
import { BoothMap, GeoJsonBooth } from "../lib/booths"
import {
  backgroundLayerStyle,
  boothLayerStyle,
  buildingLayerStyle,
  geoJsonNymblePlan2Data,
  geoJsonNymblePlan2RoutesData,
  geoJsonNymblePlan3Data,
  geoJsonNymblePlan3RoutesData,
  lineLayerStyle,
  pointLayerStyle,
  routeLayerStyle
} from "../lib/config"
import { BoothMarker } from "./BoothMarker"

// TODO: switch data using state management (based on locationID)
export function MapComponent({
  boothsById,
  location,
  activeBoothId,
  setActiveBoothId,
  hoveredBoothId,
  setHoveredBoothId,
  initialView,
  filteredBoothIds
}: {
  boothsById: BoothMap
  location: Location
  activeBoothId: BoothID | null
  hoveredBoothId: BoothID | null
  setActiveBoothId: (id: BoothID | null) => void
  setHoveredBoothId: (id: BoothID | null) => void
  initialView: { longitude: number; latitude: number; zoom: number }
  filteredBoothIds: BoothID[]
}) {
  const mapRef = useRef<MapRef>(null)

  const [markerScale, setMarkerScale] = useState(1)
  const [geoJsonPlanData, setGeojsonPlanData] = useState(geoJsonNymblePlan2Data)
  const [geoJsonNymblePlanRoutesData, setGeoJsonNymblePlanRoutesData] =
    useState(geoJsonNymblePlan2RoutesData)
  // Fly to location center on change
  useEffect(() => {
    const { longitude, latitude, zoom } = location.center
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: zoom
    })
  })

  //Change layer style data source based on selected location
  useEffect(() => {
    switch (location.id) {
      case "nymble/2": {
        setGeojsonPlanData(geoJsonNymblePlan2Data)
        setGeoJsonNymblePlanRoutesData(geoJsonNymblePlan2RoutesData)
        break
      }
      case "nymble/3": {
        setGeojsonPlanData(geoJsonNymblePlan3Data)
        setGeoJsonNymblePlanRoutesData(geoJsonNymblePlan3RoutesData)
        break
      }
      case "library":
        break
    }
  }, [location])
  // Fly to selected booth on change
  useEffect(() => {
    if (activeBoothId == null) return
    const booth = boothsById.get(activeBoothId)
    if (!booth) return

    mapRef.current?.flyTo({
      center: booth.center as [number, number],
      zoom: 19.5,
      speed: 0.8
    })
  }, [activeBoothId, boothsById])

  useFeatureState(mapRef, activeBoothId ? [activeBoothId] : [], "active")
  useFeatureState(mapRef, hoveredBoothId ? [hoveredBoothId] : [], "hover")
  useFeatureState(mapRef, filteredBoothIds, "filtered")

  const activeBooth =
    activeBoothId != null ? boothsById.get(activeBoothId) : null

  const currentGeoJsonBoothData = geoJsonBoothDataByLocation.get(location.id)!

  // Don't want to rerender markers on every map render
  const markers = useMemo(
    () =>
      Array.from(boothsById.values()).map(booth => (
        <BoothMarker key={booth.id} booth={booth} scale={markerScale} />
      )),
    [boothsById, markerScale]
  )

  function onMapClick(e: MapLayerMouseEvent) {
    const feature = e.features?.[0] as GeoJsonBooth | undefined // no other features for now
    if (feature) {
      setActiveBoothId(feature.properties.id)
    } else {
      setActiveBoothId(null) // outside click
    }
  }

  function onBoothMouseEnter(e: MapLayerMouseEvent) {
    const feature = e.features?.[0] as GeoJsonBooth | undefined
    if (feature) {
      setHoveredBoothId(feature.properties.id)
    }
  }

  function onBoothMouseLeave(e: MapLayerMouseEvent) {
    const feature = e.features?.[0] as GeoJsonBooth | undefined
    if (feature) {
      setHoveredBoothId(null)
    }
  }

  function onZoomChange() {
    const zoom = mapRef.current?.getZoom()
    if (zoom === undefined) return
    const scale = Math.max(0.3, Math.min(2, 1 + (zoom - 18) * 0.3))
    setMarkerScale(scale)
  }

  return (
    <div className="h-full w-full">
      <MapboxMap
        ref={mapRef}
        onClick={onMapClick}
        onMouseEnter={onBoothMouseEnter}
        onMouseLeave={onBoothMouseLeave}
        onZoom={onZoomChange}
        interactiveLayerIds={["booths"]}
        initialViewState={initialView}
        cursor={"auto"}
        minZoom={16}
        maxZoom={20}
        maxBounds={[
          [18.063, 59.345],
          [18.079, 59.35]
        ]}
        mapStyle="https://api.maptiler.com/maps/977e9770-60b4-4b8a-94e9-a9fa8db4c68d/style.json?key=57xj41WPFBbOEWiVSSwL">
        <Layer {...backgroundLayerStyle}></Layer>

        <Source
          id="buildings"
          type="geojson"
          promoteId={"id"}
          data={geoJsonPlanData}>
          <Layer {...buildingLayerStyle}></Layer>
        </Source>
        <Source
          id="booths"
          type="geojson"
          promoteId={"id"}
          data={currentGeoJsonBoothData}>
          <Layer {...boothLayerStyle}></Layer>
        </Source>

        <Source
          id="nymble-plan-style"
          type="geojson"
          promoteId={"id"}
          data={geoJsonPlanData}>
          <Layer {...lineLayerStyle}></Layer>
        </Source>

        <Source
          id="nymble-plan-routes"
          type="geojson"
          promoteId={"id"}
          data={geoJsonNymblePlanRoutesData}>
          <Layer {...routeLayerStyle}></Layer>
        </Source>

        <Source
          id="nymble-plan-points"
          type="geojson"
          promoteId={"id"}
          data={geoJsonPlanData}>
          <Layer {...pointLayerStyle}></Layer>
        </Source>

        {markers}
        {activeBooth && <BoothPopup key={activeBooth.id} booth={activeBooth} />}
      </MapboxMap>
    </div>
  )
}
