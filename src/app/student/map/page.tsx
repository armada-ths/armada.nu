import InteractiveMapClient from "@/components/map/InteractiveMapClient"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"

export default async function StudentMap() {
  const exhibitors = await fetchExhibitors()

  return <InteractiveMapClient exhibitors={exhibitors} />
}
