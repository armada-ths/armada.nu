"use client"

import { MenuItem, Navbar1 } from "@/components/navbar1"
import { COMING_SOON_TEXT } from "@/components/shared/ComingSoonPage"
import {
  BriefcaseIcon,
  Building2Icon,
  CalendarDaysIcon,
  CalendarSearchIcon,
  ClipboardPenIcon,
  ClockIcon,
  CompassIcon,
  HandshakeIcon,
  MapPinnedIcon,
  NotebookPenIcon,
  PackageIcon,
  SparklesIcon,
  UsersRoundIcon
} from "lucide-react"
import { DateTime } from "luxon"
import { usePathname } from "next/navigation"

import {
  createLocalePath,
  getLocaleFromPathname,
  translations
} from "@/lib/i18n"

interface NavigationMenuClientProps {
  signupUrl: string
  exhibitorPackagesEnabled: boolean
  exhibitorEventsEnabled: boolean
  eventsEnabled: boolean
  mapEnabled: boolean
  atFairEnabled: boolean
  exhibitorPageEnabled: boolean
  studentRecruitmentEnabled: boolean
  exhibitorMainEnabled: boolean
  exhibitorTimelineEnabled: boolean
  exhibitorSignupEnabled: boolean
  aboutPageEnabled: boolean
  aboutTeamEnabled: boolean
  blogEnabled: boolean
}

const applyComingSoonDescriptions = (items: MenuItem[]): MenuItem[] =>
  items.map(item => {
    if (item.items) {
      return { ...item, items: applyComingSoonDescriptions(item.items) }
    }

    if (item.disabled) {
      return { ...item, description: COMING_SOON_TEXT }
    }

    return item
  })

export function NavigationMenuClient({
  signupUrl,
  exhibitorPackagesEnabled,
  exhibitorEventsEnabled,
  eventsEnabled,
  mapEnabled,
  atFairEnabled,
  exhibitorPageEnabled,
  studentRecruitmentEnabled,
  exhibitorMainEnabled,
  exhibitorTimelineEnabled,
  exhibitorSignupEnabled,
  aboutPageEnabled,
  aboutTeamEnabled,
  blogEnabled
}: NavigationMenuClientProps) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const dict = translations[locale]
  const descriptions = dict.navDescriptions
  const withLocale = (path: string) => createLocalePath(path, locale)

  const companyLinks: MenuItem[] = [
    {
      title: dict.forExhibitors,
      url: withLocale("/exhibitor"),
      items: [
        {
          title: dict.registration,
          url: signupUrl,
          description: `${descriptions.exhibitorSignup} ${DateTime.now().year}`,
          icon: <ClipboardPenIcon className="size-5 shrink-0" />,
          tracking: {
            eventName: "exhibitor_signup_click",
            eventData: { location: "topnav_exhibitor_registration" }
          },
          disabled: !exhibitorSignupEnabled
        },
        {
          title: dict.kits,
          url: withLocale("/exhibitor/packages"),
          description: descriptions.kits,
          icon: <PackageIcon className="size-5 shrink-0" />,
          disabled: !exhibitorPackagesEnabled
        },
        {
          title: dict.whyArmada,
          url: withLocale("/exhibitor"),
          description: descriptions.whyArmada,
          icon: <HandshakeIcon className="size-5 shrink-0" />,
          disabled: !exhibitorMainEnabled
        },
        {
          title: dict.timeline,
          url: withLocale("/exhibitor/timeline"),
          description: descriptions.timeline,
          icon: <ClockIcon className="size-5 shrink-0" />,
          disabled: !exhibitorTimelineEnabled
        },
        {
          title: dict.events,
          url: withLocale("/exhibitor/events"),
          description: descriptions.exhibitorEvents,
          icon: <CalendarSearchIcon className="size-5 shrink-0" />,
          disabled: !exhibitorEventsEnabled
        }
      ]
    }
  ]

  const studentLinks: MenuItem[] = [
    {
      title: dict.forStudents,
      url: withLocale("/student/exhibitors"),
      items: [
        {
          title: dict.exhibitorsList,
          url: withLocale("/student/exhibitors"),
          description: descriptions.exhibitorsList,
          icon: <Building2Icon className="size-5 shrink-0" />,
          disabled: !exhibitorPageEnabled
        },
        {
          title: dict.events,
          url: withLocale("/student/events"),
          description: descriptions.studentEvents,
          icon: <CalendarDaysIcon className="size-5 shrink-0" />,
          disabled: !eventsEnabled
        },
        {
          title: dict.recruitment,
          url: withLocale("/student/recruitment"),
          description: `${descriptions.recruitment} ${DateTime.now().year}`,
          icon: <BriefcaseIcon className="size-5 shrink-0" />,
          tracking: {
            eventName: "student_signup_click",
            eventData: { location: "topnav_recruitment" }
          },
          disabled: !studentRecruitmentEnabled
        },
        {
          title: dict.map,
          url: withLocale("/student/map"),
          description: descriptions.map,
          icon: <MapPinnedIcon className="size-5 shrink-0" />,
          disabled: !mapEnabled
        },
        {
          title: dict.atTheFair,
          url: withLocale("/student/at-the-fair"),
          description: descriptions.atTheFair,
          icon: <CompassIcon className="size-5 shrink-0" />,
          disabled: !atFairEnabled
        }
      ]
    }
  ]

  const aboutLinks: MenuItem[] = [
    {
      title: dict.aboutUs,
      url: withLocale("/about"),
      items: [
        {
          title: dict.aboutArmada,
          url: withLocale("/about"),
          description: descriptions.aboutArmada,
          icon: <SparklesIcon className="size-5 shrink-0" />,
          disabled: !aboutPageEnabled
        },
        {
          title: dict.team,
          url: withLocale("/about/team"),
          description: `${descriptions.team} ${DateTime.now().year}`,
          icon: <UsersRoundIcon className="size-5 shrink-0" />,
          disabled: !aboutTeamEnabled
        },
        {
          title: dict.blog,
          url: withLocale("/blog"),
          description: descriptions.blog,
          icon: <NotebookPenIcon className="size-5 shrink-0" />,
          tracking: {
            eventName: "blog_click",
            eventData: { location: "topnav_blog" }
          },
          disabled: !blogEnabled
        }
      ]
    }
  ]

  const menuItems = applyComingSoonDescriptions(
    studentLinks.concat(companyLinks.concat(aboutLinks))
  )

  return (
    <>
      <div className="fixed top-0 z-40 w-screen">
        <Navbar1
          logo={{
            url: "/",
            src: "/armada_licorice.svg",
            alt: "",
            title: ""
          }}
          menu={menuItems}
        />
      </div>
    </>
  )
}
