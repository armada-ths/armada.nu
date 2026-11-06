"use client"
import { LocalizedText } from "@/i18n/text"
import { useTranslations } from "next-intl"

import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { Link } from "@armada/shared/i18n/navigation"
import { useId, type ReactNode } from "react"

function EventCard({
  title,
  image,
  imageAlt,
  summary,
  children,
  eager = false
}: {
  title: string
  image: string
  imageAlt: string
  summary: ReactNode
  children: ReactNode
  eager?: boolean
}) {
  const { width } = useScreenSize()
  const labelId = useId()
  const isMobile = width !== undefined && width <= 768
  const card = (
    <button
      type="button"
      aria-labelledby={labelId}
      disabled={width === undefined}
      className="group rounded-base border-border bg-melon text-licorice shadow-shadow focus-visible:outline-licorice flex h-full min-w-0 cursor-pointer flex-col overflow-hidden border-2 text-left transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transform-none">
      <span className="border-border relative block aspect-3/2 w-full border-b-2">
        <Image
          src={image}
          alt={imageAlt}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1040px) 317px, (min-width: 1024px) calc((100vw - 88px) / 3), (min-width: 640px) calc((100vw - 64px) / 2), calc(100vw - 40px)"
          className="object-cover"
        />
      </span>
      <span id={labelId} className="flex flex-1 flex-col p-4">
        <span className="font-heading text-xl">{title}</span>
        <span className="mt-2 grid gap-1 text-sm">{summary}</span>
        <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold underline-offset-4 group-hover:underline">
          <LocalizedText id="viewDetails" />
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </span>
      </span>
    </button>
  )

  // Keep the server render and hydration consistent without guessing a viewport.
  if (width === undefined) return card

  if (isMobile) {
    return (
      <Drawer autoFocus>
        <DrawerTrigger asChild>{card}</DrawerTrigger>
        <DrawerContent className="border-border bg-background max-h-[90dvh] border-2">
          <DrawerHeader className="px-6 text-left">
            <DrawerTitle className="text-2xl leading-tight">
              {title}
            </DrawerTitle>
            <DrawerDescription asChild className="text-foreground">
              <div className="grid gap-1">{summary}</div>
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-6 text-sm leading-relaxed">{children}</div>
          <DrawerFooter className="bg-background sticky bottom-0 px-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <DrawerClose asChild>
              <Button variant="neutral">
                <LocalizedText id="close" />
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{card}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)] sm:max-w-2xl">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle className="text-2xl leading-tight">{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="grid gap-1">{summary}</div>
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain pr-1 text-sm leading-relaxed">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ExhibitorEvents() {
  const staticT = useTranslations("Static")

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="w-full max-w-150">
          <Page.Header>
            <LocalizedText id="exhibitorEvents" />
          </Page.Header>
          <p className="text-melon mt-1 text-lg font-medium">
            <LocalizedText id="makeTheMostOfYourPresenceAt" />
          </p>
          <div className="mt-4">
            <P className="max-w-125">
              <LocalizedText id="goingBeyondTheBoothIsWhereReal" />
            </P>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <EventCard
            title={staticT("lunchLecture")}
            image="/events/lunch-lecture.webp"
            imageAlt="A speaker presenting to students in a lecture hall"
            eager
            summary={
              <>
                <span>
                  <strong>
                    <LocalizedText id="price2470031900SEKExclVAT" />
                  </strong>
                </span>
              </>
            }>
            <p>
              <LocalizedText id="ownTheRoomPresentYourCompanyYour" />
            </p>
            <p className="mt-2">
              <LocalizedText id="foodIsIncludedForBothStudentsAnd" />
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm">
              <li>
                <strong>
                  <LocalizedText id="60Attendees24700SEK" />
                </strong>
              </li>
              <li>
                <strong>
                  <LocalizedText id="100Attendees31900SEK" />
                </strong>
              </li>
            </ul>
          </EventCard>
          <EventCard
            title={staticT("panelDiscussion")}
            image="/events/panel-discussion.webp"
            imageAlt="A moderator and three panelists discussing on stage"
            eager
            summary={
              <>
                <span>
                  <strong>
                    <LocalizedText id="price9300SEKExclVAT" />
                  </strong>
                </span>
              </>
            }>
            <p>
              <LocalizedText id="positionYourCompanyAsAThoughtLeader" />
            </p>
          </EventCard>
          <EventCard
            title={staticT("fieldVisit")}
            image="/events/field-visit.webp"
            imageAlt="Students listening to a presentation during a company visit"
            eager
            summary={
              <>
                <span>
                  <strong>
                    <LocalizedText id="locationYourOffice" />
                  </strong>
                </span>
                <span>
                  <strong>
                    <LocalizedText id="price9300SEK30AttendeesExclVAT" />
                  </strong>
                </span>
              </>
            }>
            <p>
              <LocalizedText id="bringStudentsIntoYourWorldHostingA" />
            </p>
          </EventCard>
          <EventCard
            title={staticT("afterWork")}
            image="/events/after-work.webp"
            imageAlt="Students and a company representative talking at an informal gathering"
            summary={
              <>
                <span>
                  <strong>
                    <LocalizedText id="locationYourOfficeOrNymble" />
                  </strong>
                </span>
                <span>
                  <strong>
                    <LocalizedText id="price930012400SEKExclVAT" />
                  </strong>
                </span>
              </>
            }>
            <p>
              <LocalizedText id="keepTheConversationGoingAfterTheFair" />
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm">
              <li>
                <strong>
                  <LocalizedText id="atNymble12400SEK" />
                </strong>
              </li>
              <li>
                <strong>
                  <LocalizedText id="atYourOffice9300SEK" />
                </strong>
              </li>
            </ul>
          </EventCard>
          <EventCard
            title={staticT("collaborativeEvents")}
            image="/events/custom.webp"
            imageAlt="Participants gathering outdoors for a custom Armada event"
            summary={
              <>
                <span>
                  <LocalizedText id="yourConceptYourWay" />
                </span>
              </>
            }>
            <p>
              <LocalizedText id="haveSomethingMoreSpecificInMindDesign" />
            </p>
            <div className="mt-4">
              <video
                className="rounded-base border-border w-full border-2"
                poster="/thumbnails/collaborative-events-thumbnail.png"
                playsInline
                controls
                preload="metadata">
                <source
                  src="https://rsdjnixgxqauonaofrwr.supabase.co/storage/v1/object/public/armada.nu-files/collaborative-events-marketing.mp4"
                  type="video/mp4"
                />
                <LocalizedText id="yourBrowserDoesNotSupportTheVideo" />
              </video>
            </div>
            <p className="mt-2 text-sm">
              <LocalizedText id="contactOurEventsTeamForAQuotation" />{" "}
              <Link
                className="underline hover:no-underline"
                href="mailto:event@armada.nu">
                event@armada.nu
              </Link>
            </p>
          </EventCard>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
