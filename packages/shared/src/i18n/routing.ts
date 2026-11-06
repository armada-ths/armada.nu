import type {} from "./types"
import { defineRouting } from "next-intl/routing"
export const routing = defineRouting({
  locales: ["en", "sv"],
  defaultLocale: "en",
  localePrefix: "always",
  localeCookie: { name: "locale", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" }
})
export type Locale = (typeof routing.locales)[number]
export function normalizeLocale(value?: string | null): Locale {
  return value?.toLowerCase().split("-")[0] === "sv" ? "sv" : "en"
}
export function stripLocalePrefix(path: string) {
  return path.replace(/^\/(en|sv)(?=\/|$)/i, "") || "/"
}
export function localePath(path: string, locale: Locale) {
  const url = new URL(path, "https://armada.invalid")
  url.pathname =
    "/" +
    locale +
    (stripLocalePrefix(url.pathname) === "/"
      ? ""
      : stripLocalePrefix(url.pathname))
  return url.pathname + url.search + url.hash
}
export function localizedText(
  locale: Locale,
  original: string,
  swedish: string | null | undefined
): string
export function localizedText(
  locale: Locale,
  original: string | null | undefined,
  swedish: string | null | undefined
): string | null | undefined
export function localizedText(
  locale: Locale,
  original: string | null | undefined,
  swedish: string | null | undefined
) {
  return locale === "sv" && swedish?.trim() ? swedish.trim() : original
}
