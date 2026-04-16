import { feature, getSignupUrl } from "@/components/shared/feature"
import { NavigationMenuClient } from "@/components/shared/NavigationMenuClient"

export async function NavigationMenu() {
  const signupUrl = await getSignupUrl()
  const exhibitorPackagesEnabled = await feature("EXHIBITOR_PACKAGES")
  const exhibitorEventsEnabled = await feature("EXHIBITOR_EVENTS")
  const eventsEnabled = await feature("EVENT_PAGE")
  const mapEnabled = await feature("MAP_PAGE")
  const atFairEnabled = await feature("AT_FAIR_PAGE")
  const exhibitorPageEnabled = await feature("EXHIBITOR_PAGE")
  const studentRecruitmentEnabled = await feature("STUDENT_RECRUITMENT_PAGE")
  const exhibitorMainEnabled = await feature("EXHIBITOR_MAIN_PAGE")
  const exhibitorTimelineEnabled = await feature("EXHIBITOR_TIMELINE_PAGE")
  const exhibitorSignupEnabled = await feature("EXHIBITOR_SIGNUP_PAGE")
  const aboutPageEnabled = await feature("ABOUT_PAGE")
  const aboutTeamEnabled = await feature("ABOUT_TEAM_PAGE")
  const blogEnabled = await feature("ARMADA_BLOG_PAGE")

  return (
    <NavigationMenuClient
      signupUrl={signupUrl}
      exhibitorPackagesEnabled={exhibitorPackagesEnabled}
      exhibitorEventsEnabled={exhibitorEventsEnabled}
      eventsEnabled={eventsEnabled}
      mapEnabled={mapEnabled}
      atFairEnabled={atFairEnabled}
      exhibitorPageEnabled={exhibitorPageEnabled}
      studentRecruitmentEnabled={studentRecruitmentEnabled}
      exhibitorMainEnabled={exhibitorMainEnabled}
      exhibitorTimelineEnabled={exhibitorTimelineEnabled}
      exhibitorSignupEnabled={exhibitorSignupEnabled}
      aboutPageEnabled={aboutPageEnabled}
      aboutTeamEnabled={aboutTeamEnabled}
      blogEnabled={blogEnabled}
    />
  )
}
