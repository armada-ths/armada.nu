"use client"

import dynamic from "next/dynamic"

const MapWithMarker = dynamic(() => import("./LandingPageMap"), { ssr: false })

export default function MapWrapper() {
  return <MapWithMarker />
}
