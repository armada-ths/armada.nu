export const locales = ["en", "sv"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const translations: Record<
  Locale,
  {
    switchLanguage: string
    followUs: string
    students: string
    exhibitors: string
    about: string
    forExhibitors: string
    forStudents: string
    aboutUs: string
    registration: string
    kits: string
    whyArmada: string
    timeline: string
    events: string
    exhibitorsList: string
    map: string
    recruitment: string
    blog: string
    team: string
    aboutArmada: string
    joinArmada: string
    meetTheTeam: string
    readOurBlog: string
    languageToggle: string
  }
> = {
  en: {
    switchLanguage: "Svenska",
    followUs: "Follow us on:",
    students: "STUDENTS",
    exhibitors: "EXHIBITORS",
    about: "ABOUT",
    forExhibitors: "For Exhibitors",
    forStudents: "For Students",
    aboutUs: "About us",
    registration: "Registration",
    kits: "Kits",
    whyArmada: "Why Armada",
    timeline: "Timeline",
    events: "Events",
    exhibitorsList: "Exhibitors",
    map: "Map",
    recruitment: "Recruitment",
    blog: "Blog",
    team: "Team",
    aboutArmada: "About Armada",
    joinArmada: "Join Armada",
    meetTheTeam: "Meet the Team",
    readOurBlog: "Read our Blog",
    languageToggle: "SV"
  },
  sv: {
    switchLanguage: "English",
    followUs: "Följ oss på:",
    students: "STUDENTER",
    exhibitors: "UTSTÄLLARE",
    about: "OM OSS",
    forExhibitors: "För utställare",
    forStudents: "För studenter",
    aboutUs: "Om oss",
    registration: "Registrering",
    kits: "Kit",
    whyArmada: "Varför Armada",
    timeline: "Tidslinje",
    events: "Event",
    exhibitorsList: "Utställare",
    map: "Karta",
    recruitment: "Rekrytering",
    blog: "Blogg",
    team: "Team",
    aboutArmada: "Om Armada",
    joinArmada: "Gå med i Armada",
    meetTheTeam: "Träffa teamet",
    readOurBlog: "Läs vår blogg",
    languageToggle: "EN"
  }
}

export function normalizeLocale(locale?: string | null): Locale {
  if (!locale) return defaultLocale

  const normalized = locale.toLowerCase()
  if (normalized === "sv" || normalized.startsWith("sv-")) return "sv"
  if (normalized === "en" || normalized.startsWith("en-")) return "en"

  return defaultLocale
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean)
  const first = segments[0]
  return normalizeLocale(first)
}

export function stripLocalePrefix(pathname: string): string {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "")

  if (normalizedPath === "/") return "/"

  const match = normalizedPath.match(/^\/(en|sv)(?=\/|$)/i)
  if (!match) return normalizedPath

  const withoutLocale = normalizedPath.slice(match[0].length) || "/"
  return withoutLocale === "" ? "/" : withoutLocale
}

export function createLocalePath(pathname: string, locale: Locale): string {
  const nextLocale = normalizeLocale(locale)
  const withoutLocale = stripLocalePrefix(pathname)
  const basePath = withoutLocale === "/" ? "" : withoutLocale

  return `/${nextLocale}${basePath}`
}
