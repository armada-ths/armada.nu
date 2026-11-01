import type {} from "next-intl"
import type web from "../../../../apps/web/src/i18n/messages/en.json"
import type order from "../../../../apps/order/src/i18n/messages/en.json"
import type photos from "../../../../apps/photos/src/i18n/messages/en.json"

declare module "next-intl" {
  interface AppConfig {
    Locale: "en" | "sv"
    Messages: typeof web &
      Omit<typeof order, "Common" | "Metadata"> &
      Omit<typeof photos, "Common" | "Metadata">
  }
}
export {}
