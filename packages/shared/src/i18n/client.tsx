"use client"
import { NextIntlClientProvider, useLocale, useTranslations } from "next-intl"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction
} from "react"
import { usePathname, useRouter } from "next/navigation"
import type { AbstractIntlMessages } from "next-intl"
import { Link } from "./navigation"
import { localePath, normalizeLocale, stripLocalePrefix } from "./routing"

type Drafts = Record<string, unknown>
const DraftContext = createContext<{
  drafts: Drafts
  setDrafts: Dispatch<SetStateAction<Drafts>>
} | null>(null)

export function LocaleProvider({
  locale,
  messages,
  children
}: {
  locale: string
  messages: { en: AbstractIntlMessages; sv: AbstractIntlMessages }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const current = normalizeLocale(
    pathname?.match(/^\/(en|sv)(?:\/|$)/)?.[1] ?? locale
  )
  const [drafts, setDrafts] = useState<Drafts>({})
  const store = useMemo(() => ({ drafts, setDrafts }), [drafts])
  useEffect(() => {
    document.documentElement.lang = current
  }, [current])
  return (
    <DraftContext.Provider value={store}>
      <NextIntlClientProvider
        locale={current}
        messages={messages[normalizeLocale(current)]}
        timeZone="Europe/Stockholm">
        {children}
      </NextIntlClientProvider>
    </DraftContext.Provider>
  )
}

// State stays in the root provider when localized route segments are replaced.
// File objects are kept in memory, never serialized or placed in browser storage.
export function useDraftState<T>(
  name: string,
  initial: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const context = useContext(DraftContext)
  const pathname = usePathname()
  const key = stripLocalePrefix(pathname ?? "/") + ":" + name
  const [fallback, setFallback] = useState(initial)
  const current =
    context && Object.hasOwn(context.drafts, key)
      ? (context.drafts[key] as T)
      : fallback
  const setDrafts = context?.setDrafts
  const set = useCallback<Dispatch<SetStateAction<T>>>(
    action => {
      if (!setDrafts) {
        setFallback(action)
        return
      }
      setDrafts(previous => {
        const value = Object.hasOwn(previous, key)
          ? (previous[key] as T)
          : fallback
        return {
          ...previous,
          [key]:
            typeof action === "function"
              ? (action as (value: T) => T)(value)
              : action
        }
      })
    },
    [setDrafts, key, fallback]
  )
  return [current, set]
}

export function LanguageSwitcher({ refresh = true }: { refresh?: boolean }) {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("Common")
  const next = locale === "sv" ? "en" : "sv"
  return (
    <button
      type="button"
      className="rounded-full border px-3 py-1 text-sm"
      aria-label={t("switchLanguage")}
      onClick={() => {
        const url = new URL(window.location.href)
        url.pathname = localePath(url.pathname, next)
        document.cookie =
          "locale=" +
          next +
          "; Path=/; Max-Age=31536000; SameSite=Lax" +
          (url.protocol === "https:" ? "; Secure" : "")
        if (refresh)
          router.replace(url.pathname + url.search + url.hash, {
            scroll: false
          })
        else window.history.replaceState(null, "", url)
      }}>
      {locale === "sv" ? "English" : "Svenska"}
    </button>
  )
}
export {
  NextIntlClientProvider,
  useLocale,
  useTranslations,
  useFormatter
} from "next-intl"

export function LocaleMetadata({
  title: customTitle,
  description: customDescription
}: { title?: string; description?: string } = {}) {
  const locale = useLocale()
  const t = useTranslations("Metadata")
  const title = customTitle ?? t("title"),
    description = customDescription ?? t("description")
  useEffect(() => {
    document.title = title
    const element = document.querySelector('meta[name="description"]')
    if (element) element.setAttribute("content", description)
    for (const [property, content] of Object.entries({
      "og:title": title,
      "og:description": description,
      "og:locale": locale === "sv" ? "sv_SE" : "en_GB"
    })) {
      document
        .querySelector(`meta[property="${property}"]`)
        ?.setAttribute("content", content)
    }
  }, [title, description, locale])
  return null
}

export function NotFoundView() {
  const t = useTranslations("Common")
  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-3xl font-bold">{t("notFoundTitle")}</h1>
      <p className="my-6">{t("notFoundDescription")}</p>
      <Link href="/" className="underline">
        {t("home")}
      </Link>
    </section>
  )
}
export function ErrorView({ reset }: { reset: () => void }) {
  const t = useTranslations("Common")
  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center" role="alert">
      <h1 className="text-3xl font-bold">{t("errorTitle")}</h1>
      <p className="my-6">{t("error")}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full border px-4 py-2">
        {t("tryAgain")}
      </button>
    </section>
  )
}
