import type { Metadata } from "next"
import { fontVariables } from "@armada/shared/fonts"
import { AppTelemetry } from "@armada/shared/telemetry"
import "./globals.css"

export const metadata: Metadata = {
  title: "Armada Photos",
  description: "Share and view photos from Armada events.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon-180x180.png"
  }
}
export default function PhotosLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        <AppTelemetry app="photos" />
        <div
          data-photo-app
          className="min-h-screen bg-[#f7f5f2] text-[#172b35]">
          {children}
        </div>
      </body>
    </html>
  )
}
