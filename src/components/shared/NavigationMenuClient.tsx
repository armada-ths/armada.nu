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
    PackageIcon,
    SparklesIcon,
    UsersRoundIcon
} from "lucide-react"
import { DateTime } from "luxon"

interface NavigationMenuClientProps {
    signupUrl: string
    exhibitorSignupEnabled: boolean
    exhibitorPackagesEnabled: boolean
    exhibitorEventsEnabled: boolean
    eventsEnabled: boolean
    mapEnabled: boolean
    atFairEnabled: boolean
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
    exhibitorSignupEnabled,
    exhibitorPackagesEnabled,
    exhibitorEventsEnabled,
    eventsEnabled,
    mapEnabled,
    atFairEnabled
}: NavigationMenuClientProps) {
    const companyLinks: MenuItem[] = [
        {
            title: "For Exhibitors",
            url: "/exhibitor",
            items: [
                {
                    title: "Registration",
                    url: signupUrl,
                    description: `Signup as an exhibitor for Armada ${DateTime.now().year}`,
                    icon: <ClipboardPenIcon className="size-5 shrink-0" />,
                    disabled: !exhibitorSignupEnabled
                },
                {
                    title: "Packages",
                    url: "/exhibitor/packages",
                    description: "See what we have to offer",
                    icon: <PackageIcon className="size-5 shrink-0" />,
                    disabled: !exhibitorPackagesEnabled
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
                    icon: <CalendarSearchIcon className="size-5 shrink-0" />,
                    disabled: !exhibitorEventsEnabled
                }
            ]
        }
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
                    icon: <CalendarDaysIcon className="size-5 shrink-0" />,
                    disabled: !eventsEnabled
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
                    icon: <MapPinnedIcon className="size-5 shrink-0" />,
                    disabled: !mapEnabled
                },
                {
                    title: "At the Fair",
                    url: "/student/at-the-fair",
                    description: "Make the most out of your visit",
                    icon: <CompassIcon className="size-5 shrink-0" />,
                    disabled: !atFairEnabled
                }
            ]
        }
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

    const menuItems = applyComingSoonDescriptions(
        studentLinks.concat(companyLinks.concat(aboutLinks))
    )

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
    )
}
