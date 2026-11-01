import { getRequestConfig } from "@armada/shared/i18n/server"
import { normalizeLocale } from "@armada/shared/i18n/routing"
import en from "./messages/en.json"
import sv from "./messages/sv.json"
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = normalizeLocale(await requestLocale)
  return {
    locale,
    messages: locale === "sv" ? sv : en,
    timeZone: "Europe/Stockholm"
  }
})
