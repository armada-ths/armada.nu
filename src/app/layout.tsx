import Providers from "@/app/providers"
import { Footer } from "@/components/shared/Footer"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { DateTime } from "luxon"
import type { Metadata, Viewport } from "next"
import { Bebas_Neue, Inter, Lato } from "next/font/google"

import { FooterGuard } from "@/components/shared/FooterGuard"
import { DevToolbar } from "@/components/shared/VercelToolbar"
import "leaflet/dist/leaflet.css"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue"
})
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato"
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export const metadata: Metadata = {
  title: "THS Armada",
  description: `Armada is KTH's and Sweden's largest student career fair, ${DateTime.now().year} edition. Armada is a two-day event that takes place in November and is the perfect opportunity for students to meet and network with some of the Sweden's most attractive employers.`,
  keywords: [
    "student",
    "career",
    "fair",
    "companies",
    "exhibitors",
    `${DateTime.now().year}`,
    "kth",
    "ths armada",
    "ths",
    "armada"
  ],
  openGraph: {
    title: `THS Armada ${DateTime.now().year} Career Fair`,
    description: `Armada is KTH's and Sweden's largest student career fair, ${DateTime.now().year} edition. Armada is a two-day event that takes place in November and is the perfect opportunity for students to meet and network with some of the Sweden's most attractive employers.`,
    url: "https://armada.nu",
    type: "website",
    images: [
      {
        url: "/screenshots/homepage_screenshot.jpeg",
        width: 2531,
        height: 1395,
        alt: "Armada homepage"
      }
    ]
  }
}

export const revalidate = 43200 // 12 hours

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{
        colorScheme: "dark"
      }}>
      <head />
      <body
        id="root"
        className={`${inter.variable} ${bebasNeue.variable} ${lato.variable}`}>
        <Analytics />
        <SpeedInsights />
        <Providers>{children}</Providers>
        <DevToolbar />
        <FooterGuard>
          <Footer />
        </FooterGuard>
      </body>
    </html>
  )
}
