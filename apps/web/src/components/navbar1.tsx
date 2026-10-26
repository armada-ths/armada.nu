"use client"
import { Link } from "@armada/shared/i18n/navigation"
import { LanguageSwitcher } from "@armada/shared/i18n/client"

import { track } from "@vercel/analytics"
import { Menu } from "lucide-react"

import type { ComponentPropsWithRef } from "react"

import { cn } from "@/lib/utils"

import { TrackingConfig } from "@/components/shared/TrackedLink"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"

export interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: React.ReactNode
  items?: MenuItem[]
  disabled?: boolean
  tracking?: TrackingConfig
}

interface Navbar1Props {
  logo?: {
    url: string
    src: string
    alt: string
    title: string
  }
  menu?: MenuItem[]
}

const LogoLink = ({ logo }: { logo: NonNullable<Navbar1Props["logo"]> }) => (
  <Link href={logo.url} className="inline-flex items-center gap-1.5">
    <img
      src={logo.src}
      className="h-8 w-auto shrink-0"
      alt={logo.alt}
      width={32}
      height={32}
    />
    <div className="mt-1 flex items-baseline gap-1 leading-none">
      <span className="font-bebas-book text-licorice text-3xl leading-none">
        THS
      </span>
      <span className="font-bebas-bold text-licorice text-3xl leading-none">
        ARMADA
      </span>
    </div>
  </Link>
)

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/armada_licorice.svg",
    alt: "THS Armada",
    title: "THS Armada"
  },
  menu = []
}: Navbar1Props) => {
  return (
    <section className="bg-melon border-licorice flex h-20 items-center border-b-2">
      {/* Desktop Menu */}
      <div className="container">
        <nav className="hidden items-center lg:flex">
          <div className="container flex items-center">
            {/* LEFT — Logo */}
            <div className="flex flex-1 items-center gap-6">
              <LogoLink logo={logo} />
            </div>

            {/* CENTER — Navigation */}
            <div className="justify-center rounded-md">
              <NavigationMenu className="rounded-md border-none">
                <NavigationMenuList className="flex-wrap">
                  {menu.map(item => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex flex-1 items-center justify-end">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <LogoLink logo={logo} />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="neutral"
                    size="icon"
                    className="border-licorice">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-coconut overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <LogoLink logo={logo} />
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4">
                      {menu.map(item => renderMobileMenuItem(item))}
                    </Accordion>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger
          className={
            item.disabled
              ? "pointer-events-none rounded-md opacity-50"
              : "rounded-md"
          }
          aria-disabled={item.disabled ? true : undefined}>
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-snow">
          {item.items.map(subItem =>
            subItem.disabled ? (
              <SubMenuLink key={subItem.title} item={subItem} />
            ) : (
              <NavigationMenuLink asChild key={subItem.title} className="w-80">
                <SubMenuLink item={subItem} />
              </NavigationMenuLink>
            )
          )}
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  if (item.disabled) {
    return null
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className="group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium">
        <Link href={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="rounded-md">
        <AccordionTrigger
          className={
            item.disabled
              ? "text-md pointer-events-none py-4 font-semibold opacity-50 hover:no-underline"
              : "text-md py-4 font-semibold hover:no-underline"
          }
          aria-disabled={item.disabled ? true : undefined}>
          {item.title}
        </AccordionTrigger>
        <AccordionContent>
          {item.items.map(subItem => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  if (item.disabled) {
    return null
  }

  return (
    <span key={item.title} className="text-md font-semibold">
      <Link
        href={item.url}
        onClick={
          item.tracking
            ? () => track(item.tracking!.eventName, item.tracking!.eventData)
            : undefined
        }>
        {item.title}
      </Link>
    </span>
  )
}

const SubMenuLink = ({
  item,
  className,
  onClick,
  ...props
}: ComponentPropsWithRef<"a"> & { item: MenuItem }) => {
  const content = (
    <>
      <div className="text-licorice">{item.icon}</div>
      <div>
        <div className="text-licorice font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-stone-400">
            {item.description}
          </p>
        )}
      </div>
    </>
  )

  if (item.disabled) {
    return (
      <span
        className="rounded-base border-licorice flex max-w-fit cursor-not-allowed flex-row gap-4 p-3 leading-none opacity-50 select-none sm:min-w-80"
        aria-disabled>
        {content}
      </span>
    )
  }

  return (
    <Link
      {...props}
      className={cn(
        className,
        "rounded-base border-licorice flex max-w-fit flex-row gap-4 space-y-0 p-3 leading-none no-underline outline-hidden transition-colors select-none hover:border-2 sm:min-w-80"
      )}
      href={item.url}
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented && item.tracking) {
          track(item.tracking.eventName, item.tracking.eventData)
        }
      }}>
      {content}
    </Link>
  )
}

export { Navbar1 }
