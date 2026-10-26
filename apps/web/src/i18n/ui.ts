import { createTranslator } from "next-intl"
import type { Locale } from "@armada/shared/i18n/routing"
import en from "./messages/en.json"
import sv from "./messages/sv.json"
const messages = { en, sv }
export const uiSections = { en: en.Sections, sv: sv.Sections }
export function uiText(
  locale: Locale,
  key: keyof typeof en.UI,
  values?: Record<string, string | number>
) {
  return createTranslator({ locale, messages: messages[locale].UI })(
    key,
    values
  )
}
