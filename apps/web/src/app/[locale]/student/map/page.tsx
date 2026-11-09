import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import InteractiveMapClient from "@/components/map/InteractiveMapClient"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { Page } from "@/components/shared/Page"
import { feature } from "@/components/shared/feature"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { translations } from "@/i18n/dictionaries"
import { getRequestLocale } from "@/lib/i18n-server"

export async function generateMetadata() {
  const locale = await getRequestLocale()
  return pageMetadata("/student/map", {
    ...(await localeAlternates("/student/map")),
    title: translations[locale].map
  })
}

export default async function StudentMap() {
  const locale = await getRequestLocale()
  const showMap = await feature("MAP_PAGE")
  if (!showMap) {
    return <ComingSoonPage title={translations[locale].map} />
  }

  const exhibitors = await fetchExhibitors().catch((error: unknown) => {
    console.error("Failed to load exhibitors for the fair map", error)
    return []
  })

  return (
    <Page.Boundary>
      <Page.Header>{translations[locale].map}</Page.Header>
      <InteractiveMapClient exhibitors={exhibitors} />
    </Page.Boundary>
  )
}
