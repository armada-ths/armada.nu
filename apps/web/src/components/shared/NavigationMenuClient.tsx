"use client"
import { useTranslations } from "next-intl"

import { useLocale } from "@armada/shared/i18n/client"
import { normalizeLocale } from "@armada/shared/i18n/routing"

import { MenuItem, Navbar1 } from "@/components/navbar1"

import {
  BookOpenIcon,
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

import { translations } from "@/lib/i18n"

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
  historyTimelineEnabled: boolean
}

const applyComingSoonDescriptions = (
  items: MenuItem[],
  comingSoon: string
): MenuItem[] =>
  items.map(item => {
    if (item.items) {
      return {
        ...item,
        items: applyComingSoonDescriptions(item.items, comingSoon)
      }
    }

    if (item.disabled) {
      return { ...item, description: comingSoon }
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
  blogEnabled,
  historyTimelineEnabled
}: NavigationMenuClientProps) {
  const staticT = useTranslations("Static")
  const commonT = useTranslations("Common")

  const locale = normalizeLocale(useLocale())
  const dict = translations[locale]
  const descriptions = dict.navDescriptions

  const companyLinks: MenuItem[] = [
    {
      title: dict.forExhibitors,
      url: "/exhibitor",
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
          url: "/exhibitor/packages",
          description: descriptions.kits,
          icon: <PackageIcon className="size-5 shrink-0" />,
          disabled: !exhibitorPackagesEnabled
        },
        {
          title: dict.whyArmada,
          url: "/exhibitor",
          description: descriptions.whyArmada,
          icon: <HandshakeIcon className="size-5 shrink-0" />,
          disabled: !exhibitorMainEnabled
        },
        {
          title: dict.timeline,
          url: "/exhibitor/timeline",
          description: descriptions.timeline,
          icon: <ClockIcon className="size-5 shrink-0" />,
          disabled: !exhibitorTimelineEnabled
        },
        {
          title: dict.events,
          url: "/exhibitor/events",
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
      url: "/student/exhibitors",
      items: [
        {
          title: dict.exhibitorsList,
          url: "/student/exhibitors",
          description: descriptions.exhibitorsList,
          icon: <Building2Icon className="size-5 shrink-0" />,
          disabled: !exhibitorPageEnabled
        },
        {
          title: dict.events,
          url: "/student/events",
          description: descriptions.studentEvents,
          icon: <CalendarDaysIcon className="size-5 shrink-0" />,
          disabled: !eventsEnabled
        },
        {
          title: dict.recruitment,
          url: "/student/recruitment",
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
          url: "/student/map",
          description: descriptions.map,
          icon: <MapPinnedIcon className="size-5 shrink-0" />,
          disabled: !mapEnabled
        },
        {
          title: dict.atTheFair,
          url: "/student/at-the-fair",
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
      url: "/about",
      items: [
        {
          title: dict.aboutArmada,
          url: "/about",
          description: descriptions.aboutArmada,
          icon: <SparklesIcon className="size-5 shrink-0" />,
          disabled: !aboutPageEnabled
        },
        {
          title: dict.team,
          url: "/about/team",
          description: `${descriptions.team} ${DateTime.now().year}`,
          icon: <UsersRoundIcon className="size-5 shrink-0" />,
          disabled: !aboutTeamEnabled
        },
        {
          title: dict.blog,
          url: "/blog",
          description: descriptions.blog,
          icon: <NotebookPenIcon className="size-5 shrink-0" />,
          tracking: {
            eventName: "blog_click",
            eventData: { location: "topnav_blog" }
          },
          disabled: !blogEnabled
        },
        {
          title: staticT("historyOfArmada"),
          url: "/about/history",
          description: staticT("45YearsOfScandinaviasLargestStudentrunCareer"),
          icon: <BookOpenIcon className="size-5 shrink-0" />,
          disabled: !historyTimelineEnabled
        }
      ]
    }
  ]

  const menuItems = applyComingSoonDescriptions(
    studentLinks.concat(companyLinks.concat(aboutLinks)),
    commonT("comingSoon")
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
