import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Armada Map",
  description: "Interactive map of the fair"
}

export default async function Page() {
  // if (!(await feature("MAP_PAGE"))) {
  //   return notFound()
  // }

  // const exhibitors = await fetchExhibitors({
  //   year: DateTime.now().year,
  //   next: { revalidate: 3600 / 3 /* 20 min */ }
  // })

  // const exhibitorsByID = new Map(exhibitors.map(e => [e.id, e]))

  // const boothsById: BoothMap = new Map(
  //   geoJsonBoothData.features.map(feat => [
  //     feat.properties.id,
  //     makeBooth(feat, exhibitorsByID)
  //   ])
  // )

  // const boothsByLocation: Map<LocationId, BoothMap> = new Map(
  //   locations.map(loc => [loc.id, new Map()])
  // )
  // boothsById.forEach((booth, id) => {
  //   boothsByLocation.get(booth.location)!.set(id, booth)
  // })

  // return (
  //   // TODO: pt-16 is to account for the navbar, will break if navbar size changes
  //   <div className="flex h-[100dvh] pt-16">
  //     <Suspense>
  //       <MainView
  //         exhibitorsById={exhibitorsByID}
  //         boothsByLocation={boothsByLocation}
  //         boothsById={boothsById}
  //       />
  //     </Suspense>
  //   </div>
  // )
  return 404
}
