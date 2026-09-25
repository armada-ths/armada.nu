"use client"

import { redactPhotoTelemetryEvent } from "@/lib/photoTelemetry"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export function SiteTelemetry() {
  return (
    <>
      <Analytics beforeSend={redactPhotoTelemetryEvent} />
      <SpeedInsights beforeSend={redactPhotoTelemetryEvent} />
    </>
  )
}
