import InteractiveMapClient from "@/components/map/InteractiveMapClient"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"

export default async function StudentMap() {
  const showMap = await feature("MAP_PAGE")
  if (!showMap) {
    return <ComingSoonPage title="Map" />
  }

  const exhibitors = await fetchExhibitors()

  return <InteractiveMapClient exhibitors={exhibitors} />
}
