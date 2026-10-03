import { features, getSignupUrl } from "@/components/shared/feature"
import { NavigationMenuClient } from "@/components/shared/NavigationMenuClient"

export async function NavigationMenu() {
  const [signupUrl, flags] = await Promise.all([getSignupUrl(), features()])

  return (
    <NavigationMenuClient
      signupUrl={signupUrl}
      exhibitorPackagesEnabled={flags.EXHIBITOR_PACKAGES}
      exhibitorEventsEnabled={flags.EXHIBITOR_EVENTS}
      eventsEnabled={flags.EVENT_PAGE}
      mapEnabled={flags.MAP_PAGE}
      atFairEnabled={flags.AT_FAIR_PAGE}
      exhibitorPageEnabled={flags.EXHIBITOR_PAGE}
      studentRecruitmentEnabled={flags.STUDENT_RECRUITMENT_PAGE}
      exhibitorMainEnabled={flags.EXHIBITOR_MAIN_PAGE}
      exhibitorTimelineEnabled={flags.EXHIBITOR_TIMELINE_PAGE}
      exhibitorSignupEnabled={flags.EXHIBITOR_SIGNUP_PAGE}
      aboutPageEnabled={flags.ABOUT_PAGE}
      aboutTeamEnabled={flags.ABOUT_TEAM_PAGE}
      blogEnabled={flags.ARMADA_BLOG_PAGE}
    />
  )
}
