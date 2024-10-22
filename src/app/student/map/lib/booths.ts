import {
  LocationId,
  locations,
  validLocationId
} from "@/app/student/map/lib/locations"
import { getPolygonCenter } from "@/app/student/map/lib/utils"
import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import type { Feature, FeatureCollection, Polygon, Position } from "geojson"
import boothDataRaw from "../data/booths.json"
import buildingsDataRaw from "../data/buildings.json"

export type BoothID = number

export type GeoJsonBoothProperties = {
  id: BoothID
  location: LocationId
  exhibitorId: number
}

export type GeoJsonBooth = Feature<Polygon, GeoJsonBoothProperties>
export type GeoJsonBoothsData = FeatureCollection<
  Polygon,
  GeoJsonBoothProperties
>

export type Booth = {
  id: BoothID
  location: LocationId
  exhibitor: Exhibitor
  polygon: Polygon
  center: Position
}

export type BoothMap = Map<BoothID, Booth>

export const geoJsonBoothData = boothDataRaw as GeoJsonBoothsData
export const geoJsonBuildingData = buildingsDataRaw as GeoJsonBoothsData

export const geoJsonBoothDataByLocation = new Map<
  LocationId,
  GeoJsonBoothsData
>(locations.map(loc => [loc.id, { type: "FeatureCollection", features: [] }]))

geoJsonBoothData.features.forEach(feat => {
  geoJsonBoothDataByLocation.get(feat.properties.location)?.features.push(feat)
})

export function makeBooth(
  data: GeoJsonBooth,
  exhibitorsByID: Map<number, Exhibitor>
): Booth {
  const { id, location, exhibitorId } = data.properties

  const exhibitor = exhibitorsByID.get(exhibitorId)

  if (!exhibitor) {
    throw new Error(
      `No exhibitor found for booth with id ${id} (exhibitor id ${exhibitorId})`
    )
  }
  if (!validLocationId(location)) {
    throw new Error(
      `Invalid location name for booth with id ${id}: ${location}`
    )
  }

  return {
    id,
    exhibitor,
    location,
    polygon: data.geometry,
    center: getPolygonCenter(data)
  }
}
