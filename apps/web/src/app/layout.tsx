import Providers from "@/app/providers"
import { Footer } from "@/components/shared/Footer"
import { getSignupUrl } from "@/components/shared/feature"
import { DateTime } from "luxon"
import type { Metadata, Viewport } from "next"
import { fontVariables } from "@armada/shared/fonts"

import { FooterGuard } from "@/components/shared/FooterGuard"
import { SiteTelemetry } from "@/components/shared/SiteTelemetry"
import { DevToolbar } from "@/components/shared/VercelToolbar"
import { HEX_COLORS } from "@/lib/colors"
import "leaflet/dist/leaflet.css"
import "./globals.css"

const currentYear = DateTime.now().year

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: HEX_COLORS.melon
}

export const metadata: Metadata = {
  metadataBase: new URL("https://armada.nu"),
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "48x48" },
      { url: "/icons/armada-icon.svg", type: "image/svg+xml" }
    ],
    apple: "/icons/apple-touch-icon-180x180.png"
  },
  title: "THS Armada",
  description: `Armada is KTH's and Sweden's largest student career fair, ${currentYear} edition. Armada is a two-day event that takes place in November and is the perfect opportunity for students to meet and network with some of the Sweden's most attractive employers.`,
  keywords: [
    "student",
    "career",
    "fair",
    "companies",
    "exhibitors",
    `${currentYear}`,
    "kth",
    "ths armada",
    "ths",
    "armada"
  ],
  openGraph: {
    title: `THS Armada ${currentYear} Career Fair`,
    description: `Armada is KTH's and Sweden's largest student career fair, ${currentYear} edition. Armada is a two-day event that takes place in November and is the perfect opportunity for students to meet and network with some of the Sweden's most attractive employers.`,
    siteName: "THS Armada",
    url: "https://armada.nu",
    type: "website",
    images: [
      {
        url: "/screenshots/homepage_screenshot.png",
        width: 2531,
        height: 1395,
        alt: "Armada homepage"
      }
    ]
  }
}

export const revalidate = 86400 // 24 hours

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const signupUrl = await getSignupUrl()

  return (
    <html
      lang="en"
      style={{
        colorScheme: "light"
      }}>
      <head />
      <body id="root" className={fontVariables}>
        <SiteTelemetry />
        <main>
          <Providers>{children}</Providers>
        </main>
        <DevToolbar />
        <FooterGuard>
          <Footer signupUrl={signupUrl} />
        </FooterGuard>
      </body>
    </html>
  )
}
