import InteractiveMapClient from "@/components/map/InteractiveMapClient"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { translations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"

export default async function StudentMap() {
  const locale = await getRequestLocale()
  const showMap = await feature("MAP_PAGE")
  if (!showMap) {
    return <ComingSoonPage title={translations[locale].map} />
  }

  const exhibitors = await fetchExhibitors()

  return <InteractiveMapClient exhibitors={exhibitors} />
}
