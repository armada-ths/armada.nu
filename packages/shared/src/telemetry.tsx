"use client"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { redactAppTelemetry } from "./telemetry-utils"

export function AppTelemetry({ app }: { app: "photos" | "order" }) {
  return (
    <>
      <Analytics beforeSend={event => redactAppTelemetry(event, app)} />
      <SpeedInsights beforeSend={event => redactAppTelemetry(event, app)} />
    </>
  )
}
