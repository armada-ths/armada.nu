"use client"

import Link from "next/link"
import * as React from "react"

import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import { Page } from "@/components/shared/Page"
import {
  NavigationMenu as BaseNavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { DateTime } from "luxon"
import Image from "next/image"
import { useEffect, useState } from "react"

type NavigationLink = {
  title: string
  href: string
  description: string
  enabled: boolean
}

const companyLinks: NavigationLink[] = [
  {
    title: "Registration",
    href: "https://app.eventro.se/register/armada",
    description: `Signup as an exhibitor for the fair ${DateTime.now().year}`,
    enabled: true
  },
  {
    title: "Packages",
    href: "/exhibitor/packages",
    description: "See what we have to offer",
    enabled: true
  },
  {
    title: "Why Armada",
    href: "/exhibitor",
    description: "The industry's top engineers come from KTH",
    enabled: true
  },
  {
    title: "Timeline - Step by Step",
    href: "/exhibitor/timeline",
    description: "Your guide to the fair",
    enabled: true
  },
  {
    title: "Events",
    href: "/exhibitor/events",
    description: "Interested in having an event with us?",
    enabled: true
  }
]

const studentLinks: NavigationLink[] = [
  {
    title: "Exhibitors",
    href: "/student/exhibitors",
    description: `Get an in depth look at the companies attending the fair`,
    enabled: false
  },
  {
    title: "Events",
    href: "/student/events",
    description: "See the events leading up to the fair",
    enabled: false
  },
  {
    title: "Recruitment",
    href: "/student/recruitment",
    description: `Join Armada ${DateTime.now().year}. See which roles are available`,
    enabled: true
  },
  {
    title: "Map",
    href: "/student/map",
    description: "Find your way around the fair",
    enabled: false
  },
  {
    title: "At the Fair",
    href: "/student/at-the-fair",
    description: "For the fair",
    enabled: true
  }
]

const aboutLinks: NavigationLink[] = [
  {
    title: "About Armada",
    href: "/about",
    description: `Get to know the Armada organization`,
    enabled: true
  },
  {
    title: "Team",
    href: "/about/team",
    description: `Get to know the team working on Armada ${DateTime.now().year}`,
    enabled: true
  }
]

export function NavigationMenu(
  props: React.HTMLAttributes<HTMLDivElement> & {
    aside?: React.ReactNode
    float?: boolean // Default true
  }
) {
  const [sheetOpen, setSheetOpen] = useState<boolean>()
  const { className, ...rest } = props

  const { width } = useScreenSize()

  useEffect(() => {
    // Always close sheet if its open when expanding the screen size
    if ((width ?? 0) > 768 && sheetOpen) {
      setSheetOpen(false)
    }
  }, [width, sheetOpen])

  useEffect(() => {
    if (sheetOpen) {
      // This gives back the control to the underlying radix component
      // Without this the exit button and click on overlay won't work
      setSheetOpen(undefined)
    }
  }, [sheetOpen])

  return (
    <div
      className={cn(
        "flex w-screen items-center justify-end gap-x-10 px-5 py-4 md:justify-start",
        {
          "fixed top-0 z-50 h-16 bg-gradient-to-b from-stone-900 to-stone-950/40 filter backdrop-blur-lg":
            props.float !== false
        },
        className
      )}
      {...rest}>
      {/** Sheet is used for mobile navigation */}
      <Sheet open={sheetOpen}>
        <div className="flex w-full justify-between md:hidden">
          {props.aside != null && <>{props.aside}</>}
          <SheetTrigger
            className="md:hidden"
            onClick={() => setSheetOpen(true)}>
            <HamburgerMenuIcon width={30} height={30} />
          </SheetTrigger>
        </div>
        <SheetContent className="md:hidden">
          <Link href="/" onClick={() => setSheetOpen(false)}>
            <p className="font-bebas-neue text-xl text-melon-700">Home</p>
          </Link>
          <Separator className="my-4" />
          <Page.Header tier="secondary" className="text-2xl">
            Student
          </Page.Header>
          {studentLinks
            .filter(link => link.enabled)
            .map(component => (
              <div key={component.href} className="mt-2">
                <Link
                  onClick={() => setSheetOpen(false)}
                  className="font-bebas-neue text-xl text-melon-700"
                  href={component.href}>
                  {component.title}
                </Link>
              </div>
            ))}
          <Separator className="my-4" />
          <Page.Header tier="secondary" className="text-2xl">
            Exhibitor
          </Page.Header>
          {companyLinks
            .filter(link => link.enabled)
            .map(component => (
              <div key={component.href} className="mt-2">
                <Link
                  onClick={() => setSheetOpen(false)}
                  className="font-bebas-neue text-xl text-melon-700"
                  href={component.href}>
                  {component.title}
                </Link>
              </div>
            ))}
          <Separator className="my-4" />
          <Page.Header tier="secondary" className="text-2xl">
            About us
          </Page.Header>
          {aboutLinks
            .filter(link => link.enabled)
            .map(component => (
              <div key={component.href} className="mt-2">
                <Link
                  onClick={() => setSheetOpen(false)}
                  className="font-bebas-neue text-xl text-melon-700"
                  href={component.href}>
                  {component.title}
                </Link>
              </div>
            ))}
          <Separator className="my-4" />
          <Link
            onClick={() => setSheetOpen(false)}
            className="font-bebas-neue text-2xl text-melon-700"
            href="/blog">
            The Armada Blog
          </Link>
        </SheetContent>
      </Sheet>
      {/** BaseNavigationMenu is used for desktop navigation  */}
      <div className="hidden flex-1 justify-between md:flex">
        <BaseNavigationMenu className="">
          <NavigationMenuList>
            <NavigationMenuItem className="dark:hover:text-melon-700">
              <NavigationMenuLink asChild>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  <Image
                    className="hover:brightness-90"
                    src={"/armada_white.svg"}
                    alt="Armada Logo White"
                    width={30}
                    height={30}
                  />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                href="/student/recruitment"
                className="dark:hover:text-melon-700">
                For Students
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  {studentLinks
                    .filter(link => link.enabled)
                    .map(component => (
                      <ListItem
                        key={component.href}
                        href={component.href}
                        title={component.title}>
                        {component.description}
                      </ListItem>
                    ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                href="/exhibitor"
                className="dark:hover:text-melon-700">
                For Exhibitors
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {companyLinks
                    .filter(link => link.enabled)
                    .map(component => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem className="hover:text-melon-700 dark:hover:text-melon-700">
              <NavigationMenuTrigger
                href="/about"
                className={navigationMenuTriggerStyle()}>
                About us
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {aboutLinks
                    .filter(link => link.enabled)
                    .map(component => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem className="hover:text-melon-700 dark:hover:text-melon-700">
              <NavigationMenuLink href="/blog" className={navigationMenuTriggerStyle()}>
                The Armada Blog
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </BaseNavigationMenu>
        {props.aside != null && <div>{props.aside}</div>}
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, href, title, children, ...props }, ref) => {
  if (href == null) {
    console.error("ListItem: href is required")
    return null
  }
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-stone-900",
            className
          )}
          {...props}>
          <div className="text-sm font-medium leading-none text-melon-700">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-stone-400">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
