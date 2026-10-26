import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { fontVariables } from "@armada/shared/fonts"
import { AppTelemetry } from "@armada/shared/telemetry"
import { LocaleProvider } from "@armada/shared/i18n/client"
import { PhotosWorkspace } from "@photos/components/PhotosWorkspace"
import { PhotosHeader, PhotosMetadata } from "@photos/components/PhotosHeader"
import en from "@photos/i18n/messages/en.json"
import sv from "@photos/i18n/messages/sv.json"
import "./globals.css"
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata")
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
    icons: {
      icon: "/icons/favicon.ico",
      apple: "/icons/apple-touch-icon-180x180.png"
    }
  }
}
export default async function PhotosLayout({
  children
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body className={fontVariables}>
        <LocaleProvider locale={locale} messages={{ en, sv }}>
          <PhotosMetadata />
          <AppTelemetry app="photos" />
          <div
            data-photo-app
            className="min-h-screen bg-[#f7f5f2] text-[#172b35]">
            <PhotosHeader />
            <PhotosWorkspace>{children}</PhotosWorkspace>
          </div>
        </LocaleProvider>
      </body>
    </html>
  )
}
