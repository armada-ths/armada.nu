"use client"


import { MenuItem, Navbar1 } from "@/components/navbar1"
import { BriefcaseIcon, Building2Icon, CalendarDaysIcon, CalendarSearchIcon, ClipboardPenIcon, ClockIcon, CompassIcon, HandshakeIcon, MapPinnedIcon, PackageIcon, SparklesIcon, UsersRoundIcon } from "lucide-react"
import { DateTime } from "luxon"

const companyLinks: MenuItem[] = [
  {
    title: "For Exhibitors",
    url: "/exhibitor",
    items: [
      {
        title: "Registration",
        url: "https://app.eventro.se/register/armada",
        description: `Signup as an exhibitor for the fair ${DateTime.now().year}`,
        icon: <ClipboardPenIcon className="size-5 shrink-0" />
      },
      {
        title: "Packages",
        url: "/exhibitor/packages",
        description: "See what we have to offer",
        icon: <PackageIcon className="size-5 shrink-0" />
      },
      {
        title: "Why Armada",
        url: "/exhibitor",
        description: "The industry's top engineers come from KTH",
        icon: <HandshakeIcon className="size-5 shrink-0" />
      },
      {
        title: "Timeline - Step by Step",
        url: "/exhibitor/timeline",
        description: "Your guide to the fair",
        icon: <ClockIcon className="size-5 shrink-0" />
      },
      {
        title: "Events",
        url: "/exhibitor/events",
        description: "Interested in having an event with us?",
        icon: <CalendarSearchIcon className="size-5 shrink-0" />
      }
    ]
  },
]

const studentLinks: MenuItem[] = [
  {
    title: "For Students",
    url: "/student/exhibitors",
    items: [

      {
        title: "Exhibitors",
        url: "/student/exhibitors",
        description: `Look at the companies attending the fair`,
        icon: <Building2Icon className="size-5 shrink-0" />
      },
      {
        title: "Events",
        url: "/student/events",
        description: "See the events leading up to the fair",
        icon: <CalendarDaysIcon className="size-5 shrink-0" />
      },
      {
        title: "Recruitment",
        url: "/student/recruitment",
        description: `Join Armada ${DateTime.now().year}. See which roles are available`,
        icon: <BriefcaseIcon className="size-5 shrink-0" />
      },
      {
        title: "Map",
        url: "/student/map",
        description: "Find your way around the fair",
        icon: <MapPinnedIcon className="size-5 shrink-0" />
      },
      {
        title: "At the Fair",
        url: "/student/at-the-fair",
        description: "For the fair",
        icon: <CompassIcon className="size-5 shrink-0" />
      }
    ]
  },
]

const aboutLinks: MenuItem[] = [
  {
    title: "About us",
    url: "/about",
    items: [
      {
        title: "About Armada",
        url: "/about",
        description: `Get to know the Armada organization`,
        icon: <SparklesIcon className="size-5 shrink-0" />
      },
      {
        title: "Team",
        url: "/about/team",
        description: `Get to know the team working on Armada ${DateTime.now().year}`,
        icon: <UsersRoundIcon className="size-5 shrink-0" />
      }
    ]
  }
]

export function NavigationMenu() {
  const menuItems = studentLinks.concat(companyLinks.concat(aboutLinks))
  return (
    <>
      <div className="fixed top-0 z-40 w-screen">
        <Navbar1
          logo={{
            url: "/",
            src: "/armada_white.svg",
            alt: "",
            title: ""
          }}
          menu={menuItems}
        />
      </div>
    </>
  );
}
