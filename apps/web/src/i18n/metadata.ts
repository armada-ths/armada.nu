import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
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
  const t = await getTranslations("Metadata")
  return {
    ...metadata,
    ...alternates,
    openGraph: {
      type: "website",
      siteName: "THS Armada",
      locale: locale === "sv" ? "sv_SE" : "en_GB",
      url: "/" + locale + (path === "/" ? "" : path),
      ...(metadata.title ? { title: metadata.title as string } : {}),
      description: metadata.description ?? t("description"),
      alternateLocale: locale === "sv" ? ["en_GB"] : ["sv_SE"],
      images: [
        {
          url: "/screenshots/homepage_screenshot.png",
          width: 2531,
          height: 1395,
          alt: t("imageAlt")
        }
      ],
      ...metadata.openGraph
    }
  }
}
