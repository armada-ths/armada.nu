import { getTranslations } from "next-intl/server"
import { LocaleProvider } from "@armada/shared/i18n/client"
import en from "@/i18n/messages/en.json"
import sv from "@/i18n/messages/sv.json"
import Providers from "@/app/providers"
import { Footer } from "@/components/shared/Footer"
import { getSignupUrl } from "@/components/shared/feature"

import type { Metadata, Viewport } from "next"
import { fontVariables } from "@armada/shared/fonts"

import { FooterGuard } from "@/components/shared/FooterGuard"
import { SiteTelemetry } from "@/components/shared/SiteTelemetry"
import { DevToolbar } from "@/components/shared/VercelToolbar"
import { HEX_COLORS } from "@/lib/colors"
import { getRequestLocale } from "@/lib/i18n-server"
import { isProductionDeployment } from "@/lib/deployment"
import "leaflet/dist/leaflet.css"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: HEX_COLORS.melon
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata")
  const locale = await getRequestLocale()
  return {
    robots: isProductionDeployment()
      ? undefined
      : { index: false, follow: false },
    metadataBase: new URL("https://armada.nu"),
    icons: {
      icon: [
        { url: "/icons/favicon.ico", sizes: "48x48" },
        { url: "/icons/armada-icon.svg", type: "image/svg+xml" }
      ],
      apple: "/icons/apple-touch-icon-180x180.png"
    },
    title: "THS Armada",
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "THS Armada",
      type: "website",
      locale: locale === "sv" ? "sv_SE" : "en_GB",
      alternateLocale: locale === "sv" ? ["en_GB"] : ["sv_SE"],
      images: [
        {
          url: "/screenshots/homepage_screenshot.png",
          width: 2531,
          height: 1395,
          alt: t("imageAlt")
        }
      ]
    }
  }
}

export const revalidate = 86400 // 24 hours

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getRequestLocale()
  const signupUrl = await getSignupUrl()

  return (
    <html
      lang={locale}
      style={{
        colorScheme: "light"
      }}>
      <head />
      <body id="root" className={fontVariables}>
        <LocaleProvider locale={locale} messages={{ en, sv }}>
          <SiteTelemetry />
          <main>
            <Providers>{children}</Providers>
          </main>
          <DevToolbar />
          <FooterGuard>
            <Footer signupUrl={signupUrl} />
          </FooterGuard>
        </LocaleProvider>
      </body>
    </html>
  )
}
