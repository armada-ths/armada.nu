"use client"

import { BoothMarker } from "@/app/student/map/_components/BoothMarker"
import { EditorToolbar } from "@/app/student/map/editor/EditorToolbar"
import { FeatureEditor } from "@/app/student/map/editor/FeatureEditor"
import {
  Booth,
  BoothID,
  GeoJsonBooth,
  geoJsonBoothData,
  GeoJsonBoothsData,
  geoJsonBuildingData,
  makeBooth
} from "@/app/student/map/lib/booths"
import {
  backgroundLayerStyle,
  buildingLayerStyle,
  lineLayerStyle,
  routeLayerStyle,
  symbolLayerStyle
} from "@/app/student/map/lib/config"
import { Location } from "@/app/student/map/lib/locations"
import { getPolygonCenter } from "@/app/student/map/lib/utils"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useGeoJsonPlanData } from "@/components/shared/hooks/useGeoJsonPlanData"
import MapboxDraw, { DrawMode } from "@mapbox/mapbox-gl-draw"
import { Feature, Polygon } from "geojson"
import "maplibre-gl/dist/maplibre-gl.css"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  Layer,
  Map as MapboxMap,
  MapRef,
  Popup,
  Source
} from "react-map-gl/maplibre"

export type FeatureMap = Map<BoothID, GeoJsonBooth>

export default function EditorMapComponent({
  location,
  exhibitorsById: exhibitorsByID
}: {
  location: Location
  exhibitorsById: Map<number, Exhibitor>
}) {
  const mapRef = useRef<MapRef>(null)

  const [drawMode, setDrawMode] = useState<DrawMode>("simple_select")

  const [mapLoaded, setMapLoaded] = useState(false)

  const [showBuildings, setShowBuildings] = useState(false)

  const [geoJsonPlanData, geoJsonNymblePlanRoutesData] =
    useGeoJsonPlanData(location)

  const geoJsonData = showBuildings ? geoJsonBuildingData : geoJsonBoothData

  // this is the main data structure for storing the editable features
  // i think the reason for using a ref here instead of state was to avoid unnecessary rerenders,
  // and also to simplify update operations since you dont need to care about immutability like with state
  const featureMap = useRef<FeatureMap>(
    new Map(geoJsonData.features.map(feat => [feat.properties.id, feat]))
  )

  const [activeFeatureId, setActiveFeatureId] = useState<BoothID | null>(null)

  const activeFeature = activeFeatureId
    ? featureMap.current.get(activeFeatureId)!
    : null

  const popupLocation = activeFeature ? getPolygonCenter(activeFeature) : null

  const [booths, setBooths] = useState<Booth[]>([])

  const markers = booths.map(booth => (
    <BoothMarker key={booth.id} booth={booth} scale={1} />
  ))

  const draw = useMemo(() => {
    return new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: "simple_select"
    })
  }, [])

  // featureMap api functions ----------------------------

  function setFeature(feat: GeoJsonBooth) {
    featureMap.current.set(feat.properties.id, feat)
  }

  function deleteFeature(feat: GeoJsonBooth) {
    featureMap.current.delete(feat.properties.id)
  }

  function resetFeatures(geoJsonData: GeoJsonBoothsData) {
    featureMap.current = new Map(
      geoJsonData.features.map(feat => [feat.properties.id, feat])
    )
    updateBooths()
    updateDrawFeatures()
  }

  // Event handlers --------------------------------------

  function onModeChange(e: { mode: DrawMode }) {
    setDrawMode(e.mode)
  }

  function onSelectionChange(e: { features: GeoJsonBooth[] }) {
    if (e.features.length === 0) return
    if (activeFeature == null) setActiveFeatureId(e.features[0].properties.id)
    else setActiveFeatureId(null)
  }

  function onCreate(e: { features: Feature<Polygon>[] }) {
    e.features.forEach(feat => {
      const id = Math.max(...Array.from(featureMap.current.keys())) + 1
      const newFeat = {
        ...feat,
        id,
        properties: { id, location: location.id, exhibitorId: -1 }
      }
      setFeature(newFeat)
      setActiveFeatureId(id)
      draw.delete(feat.id as string)
      draw.add(newFeat)
    })
  }

  function onUpdate(e: { features: GeoJsonBooth[] }) {
    e.features.forEach(feat => setFeature(feat))
    updateBooths()
  }

  function onDelete(e: { features: GeoJsonBooth[] }) {
    e.features.forEach(feat => deleteFeature(feat))
    updateBooths()
  }

  // Effects ----------------------------------------------

  function initializeDraw() {
    if (!mapLoaded || !mapRef.current) return
    const map = mapRef.current

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!map.hasControl(draw)) map.addControl(draw, "top-left")

    map.on("draw.create", onCreate)
    map.on("draw.update", onUpdate)
    map.on("draw.delete", onDelete)
    map.on("draw.selectionchange", onSelectionChange)
    map.on("draw.modechange", onModeChange)

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      map.removeControl(draw)
      map.off("draw.create", onCreate)
      map.off("draw.update", onUpdate)
      map.off("draw.delete", onDelete)
      map.off("draw.selectionchange", onSelectionChange)
      map.off("draw.modechange", onModeChange)
    }
  }

  function updateDrawFeatures() {
    if (!mapLoaded) return
    const currentFeatures: GeoJsonBoothsData = {
      type: "FeatureCollection",
      features: Array.from(featureMap.current.values()).filter(
        feat => feat.properties.location === location.id
      )
    }
    draw.set(currentFeatures)
  }

  function updateBooths() {
    const feats = Array.from(featureMap.current.values())
    const booths = feats
      .filter(
        feat =>
          feat.properties.location === location.id &&
          feat.properties?.exhibitorId >= 0 // booths that were just created have exhibitorId -1
      )
      .map(feat => makeBooth(feat as GeoJsonBooth, exhibitorsByID))
    setBooths(booths)
  }

  useEffect(initializeDraw, [mapLoaded])
  useEffect(updateDrawFeatures, [location, mapLoaded])
  useEffect(updateBooths, [location, mapLoaded])

  return (
    <div className="flex h-full w-full justify-center">
      <MapboxMap
        ref={mapRef}
        onLoad={() => setMapLoaded(true)}
        initialViewState={{
          longitude: 18.070567,
          latitude: 59.34726,
          zoom: 18
        }}
        cursor={"auto"}
        minZoom={16}
        maxZoom={25}
        maxBounds={[
          [18.063, 59.345],
          [18.079, 59.35]
        ]}
        mapStyle="https://api.maptiler.com/maps/977e9770-60b4-4b8a-94e9-a9fa8db4c68d/style.json?key=57xj41WPFBbOEWiVSSwL">
        <Layer {...backgroundLayerStyle}></Layer>

        {/** Order sensitive! */}
        <Source
          id="buildings"
          type="geojson"
          promoteId={"id"}
          data={geoJsonPlanData}>
          <Layer {...buildingLayerStyle}></Layer>
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
          <Layer {...symbolLayerStyle}></Layer>
        </Source>

        {mapLoaded && !showBuildings && markers}

        {mapLoaded && activeFeatureId != null && (
          <Popup
            key={activeFeatureId}
            longitude={popupLocation![0]}
            latitude={popupLocation![1]}
            closeButton={true}
            onClose={() => setActiveFeatureId(null)}>
            <FeatureEditor
              feat={activeFeature!}
              setActiveFeatureId={setActiveFeatureId}
              exhibitorsByID={exhibitorsByID}
              onSave={feat => {
                setFeature(feat)
                draw.add(feat)
                updateBooths()
              }}
              onDelete={feat => {
                deleteFeature(feat)
                draw.delete(feat.id as string)
                updateBooths()
                setActiveFeatureId(null)
              }}
            />
          </Popup>
        )}
      </MapboxMap>

      {mapLoaded && (
        <EditorToolbar
          draw={draw}
          drawMode={drawMode}
          setDrawMode={setDrawMode}
          resetFeatures={resetFeatures}
          showBuildings={showBuildings}
          setShowBuildings={setShowBuildings}
          featureMap={featureMap}
        />
      )}
    </div>
  )
}
