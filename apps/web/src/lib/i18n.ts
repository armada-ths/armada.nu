import {
  localePath,
  localizedText,
  normalizeLocale,
  stripLocalePrefix,
  type Locale
} from "@armada/shared/i18n/routing"
export { normalizeLocale, stripLocalePrefix }
export type { Locale }
export const locales = ["en", "sv"] as const
export const defaultLocale: Locale = "en"
export { translations, pageTranslations } from "../i18n/dictionaries"

export function createLocalePath(pathname: string | null, locale: Locale) {
  return localePath(pathname ?? "/", locale)
}
export function resolveLocalizedHighlightCardCopy(
  locale: Locale,
  card: {
    title?: string | null
    titleSv?: string | null
    subtitle?: string | null
    subtitleSv?: string | null
    description?: string | null
    descriptionSv?: string | null
    linkText?: string | null
    linkTextSv?: string | null
  }
) {
  return {
    title: localizedText(locale, card.title, card.titleSv),
    subtitle: localizedText(locale, card.subtitle, card.subtitleSv),
    description: localizedText(locale, card.description, card.descriptionSv),
    linkText: localizedText(locale, card.linkText, card.linkTextSv)
  }
}
