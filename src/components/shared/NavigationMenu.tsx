import { feature, getSignupUrl } from "@/components/shared/feature"
import { NavigationMenuClient } from "@/components/shared/NavigationMenuClient"

export async function NavigationMenu() {
  const exhibitorSignupEnabled = await feature("EXHIBITOR_SIGNUP")
  const signupUrl = await getSignupUrl()
  const exhibitorPackagesEnabled = await feature("EXHIBITOR_PACKAGES")
  const exhibitorEventsEnabled = await feature("EXHIBITOR_EVENTS")
  const eventsEnabled = await feature("EVENT_PAGE")
  const mapEnabled = await feature("MAP_PAGE")
  const atFairEnabled = await feature("AT_FAIR_PAGE")

  return (
    <NavigationMenuClient
      signupUrl={signupUrl}
      exhibitorSignupEnabled={exhibitorSignupEnabled}
      exhibitorPackagesEnabled={exhibitorPackagesEnabled}
      exhibitorEventsEnabled={exhibitorEventsEnabled}
      eventsEnabled={eventsEnabled}
      mapEnabled={mapEnabled}
      atFairEnabled={atFairEnabled}
    />
  )
}
