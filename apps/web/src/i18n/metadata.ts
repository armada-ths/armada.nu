import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
export async function localeAlternates(path: string): Promise<Metadata> {
  const locale = await getLocale()
  return {
    alternates: {
      canonical: "/" + locale + (path === "/" ? "" : path),
      languages: {
        en: "/en" + (path === "/" ? "" : path),
        sv: "/sv" + (path === "/" ? "" : path)
      }
    }
  }
}

export async function pageMetadata(
  path: string,
  metadata: Metadata
): Promise<Metadata> {
  const locale = await getLocale()
  const alternates = await localeAlternates(path)
  return {
    ...metadata,
    ...alternates,
    openGraph: {
      type: "website",
      siteName: "THS Armada",
      locale: locale === "sv" ? "sv_SE" : "en_GB",
      url: "/" + locale + (path === "/" ? "" : path),
      ...(metadata.title ? { title: metadata.title as string } : {}),
      ...(metadata.description ? { description: metadata.description } : {}),
      ...metadata.openGraph
    }
  }
}
