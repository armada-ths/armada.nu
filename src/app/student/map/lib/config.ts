import { FeatureCollection, LineString, Point, Polygon } from "geojson"
import {
  BackgroundLayer,
  CircleLayer,
  FillLayer,
  LineLayer
} from "react-map-gl/maplibre"
import nymblePlan2DataRaw from "../data/nymble.plan2.json"
import nymblePlan2RoutesDataRaw from "../data/nymble.plan2.routes.json"
import nymblePlan3DataRaw from "../data/nymble.plan3.json"
import nymblePlan3RoutesDataRaw from "../data/nymble.plan3.routes.json"

export type GeoJsonPlanData = FeatureCollection<Polygon | LineString | Point>
export type GeoJsonLinesData = FeatureCollection<LineString>
export const geoJsonNymblePlan2Data = nymblePlan2DataRaw as GeoJsonPlanData
export const geoJsonNymblePlan2RoutesData =
  nymblePlan2RoutesDataRaw as GeoJsonLinesData
export const geoJsonNymblePlan3Data = nymblePlan3DataRaw as GeoJsonPlanData
export const geoJsonNymblePlan3RoutesData =
  nymblePlan3RoutesDataRaw as GeoJsonLinesData

const style = {
  boothFillColor: "#89bc82",
  boothOutlineColor: "#0e3e08",

  boothActiveFillColor: "#21c00d",
  boothHoveredFillColor: "#a0df98",
  boothNotFilteredOpacity: 0.4,

  buildingBackgroundColor: "#1A201C",
  buildingOutlineColor: "#ff0000",
  buildingOutlineWidth: 2,

  buildingStructureColor: "#17845A",
  buildingStructureWidth: 3,

  routeColor: "#F3ECC3",
  routeWidth: 2,

  routeHintColor: "#F3E592",
  routeHintWidth: 1,

  backgroundColor: "#40d07e",
  backgroundOpacity: 0.2
} as const

export enum LineType {
  Boundary = "Boundary",
  Route = "Route",
  RouteHint = "RouteHint"
}

export enum PointType {
  Exit = "Exit",
  Door = "Door",
  WC = "WC",
  Stair = "Stair",
  Disability = "Disability"
}
// features can be styled based on properties or feature state using a weird expression language, see:
// https://docs.mapbox.com/style-spec/reference/expressions/#data-expressions for reference

export const boothLayerStyle: FillLayer = {
  source: "booths",
  id: "booths",
  type: "fill",
  paint: {
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "filtered"], false],
      1,
      style.boothNotFilteredOpacity
    ],
    "fill-outline-color": style.boothOutlineColor,
    "fill-color": [
      "case",
      ["boolean", ["feature-state", "active"], false],
      style.boothActiveFillColor,
      ["boolean", ["feature-state", "hover"], false],
      style.boothHoveredFillColor,
      style.boothFillColor
    ]
  }
}

export const buildingLayerStyle: FillLayer = {
  source: "buildings",
  id: "buildings",
  type: "fill",
  filter: ["==", "$type", "Polygon"],
  paint: {
    "fill-color": style.buildingBackgroundColor
  }
}

export const backgroundLayerStyle: BackgroundLayer = {
  id: "background",
  type: "background",
  paint: {
    "background-color": style.backgroundColor,
    "background-opacity": style.backgroundOpacity
  }
}

export const lineLayerStyle: LineLayer = {
  source: "lines",
  id: "lines",
  type: "line",
  filter: ["==", "$type", "LineString"],
  paint: {
    "line-color": style.buildingStructureColor,
    "line-width": style.buildingStructureWidth
  }
}

export const routeLayerStyle: LineLayer = {
  source: "routes",
  id: "routes",
  type: "line",
  filter: ["==", "$type", "LineString"],
  paint: {
    "line-color": [
      "case",
      ["==", ["get", "lineType"], LineType.Route],
      style.routeColor,
      ["==", ["get", "lineType"], LineType.RouteHint],
      style.routeHintColor,
      style.buildingStructureColor
    ],
    "line-width": [
      "case",
      ["==", ["get", "lineType"], LineType.Route],
      style.routeWidth,
      ["==", ["get", "lineType"], LineType.RouteHint],
      style.routeHintWidth,
      style.buildingStructureWidth
    ],
    // Apply dash pattern for Route lines
    "line-dasharray": ["literal", [2, 2]]
  }
}

// CircleLayer for points
export const pointLayerStyle: CircleLayer = {
  source: "points",
  id: "points",
  type: "circle",
  filter: ["==", "$type", "Point"],
  paint: {
    "circle-color": [
      "case",
      ["==", ["get", "pointType"], PointType.Exit],
      "#FF0000",
      ["==", ["get", "pointType"], PointType.Door],
      "#00FF00",
      ["==", ["get", "pointType"], PointType.WC],
      "#0000FF",
      ["==", ["get", "pointType"], PointType.Stair],
      "#FFFF00",
      ["==", ["get", "pointType"], PointType.Disability],
      "#FFA500",
      "#000000"
    ],
    "circle-radius": 6
  }
}
