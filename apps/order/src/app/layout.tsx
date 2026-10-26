import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { fontVariables } from "@armada/shared/fonts"
import { AppTelemetry } from "@armada/shared/telemetry"
import { Toaster } from "@armada/shared/ui/sonner"
import { LocaleProvider, LocaleMetadata } from "@armada/shared/i18n/client"
import { OrderHeader } from "@order/components/order/OrderHeader"
import en from "@order/i18n/messages/en.json"
import sv from "@order/i18n/messages/sv.json"
import "./globals.css"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata")
  const locale = await getLocale()
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "sv" ? "sv_SE" : "en_GB"
    },
    robots: { index: false, follow: false },
    icons: { icon: "/icons/favicon.ico" }
  }
}
export default async function OrderLayout({
  children
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body className={fontVariables}>
        <LocaleProvider locale={locale} messages={{ en, sv }}>
          <LocaleMetadata />
          <AppTelemetry app="order" />
          <OrderHeader />
          {children}
          <Toaster expand closeButton />
        </LocaleProvider>
      </body>
    </html>
  )
}
