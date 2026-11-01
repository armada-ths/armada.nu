import { LocaleProvider } from "@armada/shared/i18n/client"
import en from "../i18n/messages/en.json"
import sv from "../i18n/messages/sv.json"
import type { Metadata } from "next"
import Link from "next/link"
import { fontVariables } from "@armada/shared/fonts"
import { AppTelemetry } from "@armada/shared/telemetry"
import { Toaster } from "@armada/shared/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Order Form - Exhibitor Lounge",
  description: "Order drinks and snacks from the lounge.",
  robots: { index: false, follow: false },
  icons: { icon: "/icons/favicon.ico" }
}
export default function OrderLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        <LocaleProvider locale="en" messages={{ en, sv }}>
          <AppTelemetry app="order" />
          <header className="border-border border-b px-5 py-4">
            <Link
              href="https://armada.nu"
              className="font-bebas-neue text-melon text-3xl">
              THS Armada
            </Link>
          </header>
          {children}
          <Toaster expand closeButton />
        </LocaleProvider>
      </body>
    </html>
  )
}
