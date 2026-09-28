"use client"

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
import Link from "next/link"
import type { ReactNode } from "react"

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
  const isMobile = width !== undefined && width <= 768
  const card = (
    <button
      type="button"
      aria-label={`View ${title} details`}
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
      <span className="flex flex-1 flex-col p-4">
        <span className="font-heading text-xl">{title}</span>
        <span className="mt-2 grid gap-1 text-sm">{summary}</span>
        <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold underline-offset-4 group-hover:underline">
          View details <ArrowUpRight aria-hidden="true" className="size-4" />
        </span>
      </span>
    </button>
  )

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
              <Button variant="neutral">Close</Button>
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
  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="w-full max-w-150">
          <Page.Header>Exhibitor Events</Page.Header>
          <p className="text-melon mt-1 text-lg font-medium">
            Make the Most of Your Presence at Armada
          </p>
          <div className="mt-4">
            <P className="max-w-125">
              Going beyond the booth is where real talent connections are made.
              These events give you dedicated time and space to showcase your
              brand, culture, and people to KTH&apos;s most driven students, on
              your terms. Pick a format, or build your own.
            </P>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <EventCard
            title="Lunch Lecture"
            image="/events/lunch-lecture.webp"
            imageAlt="A speaker presenting to students in a lecture hall"
            eager
            summary={
              <>
                <span>
                  <strong>Price: 24,700 / 31,900 SEK excl. VAT</strong>
                </span>
              </>
            }>
            <p>
              Own the room. Present your company, your culture, or a topic
              you&apos;re passionate about — while students enjoy a free lunch
              courtesy of you. It&apos;s a captive, curious audience in a
              relaxed setting, and one of the most effective ways to leave a
              lasting impression.
            </p>
            <p className="mt-2">
              Food is included for both students and your representatives.
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm">
              <li>
                <strong>60 attendees: 24,700 SEK</strong>
              </li>
              <li>
                <strong>100 attendees: 31,900 SEK</strong>
              </li>
            </ul>
          </EventCard>
          <EventCard
            title="Panel Discussion"
            image="/events/panel-discussion.webp"
            imageAlt="A moderator and three panelists discussing on stage"
            eager
            summary={
              <>
                <span>
                  <strong>Price: 9,300 SEK excl. VAT</strong>
                </span>
              </>
            }>
            <p>
              Position your company as a thought leader. Join a moderated,
              themed panel alongside representatives from other leading
              companies and engage students in an honest, dynamic conversation
              about industry trends, challenges, and careers. Great for brand
              credibility and visibility — and you might learn something too.
            </p>
          </EventCard>
          <EventCard
            title="Field Visit"
            image="/events/field-visit.webp"
            imageAlt="Students listening to a presentation during a company visit"
            eager
            summary={
              <>
                <span>
                  <strong>Location: Your office</strong>
                </span>
                <span>
                  <strong>Price: 9,300 SEK / 30 attendees excl. VAT</strong>
                </span>
              </>
            }>
            <p>
              Bring students into your world. Hosting a visit at your office is
              one of the most authentic ways to communicate who you are as an
              employer — your space, your team, your energy. Students get a real
              feel for what working with you looks like, and you get face time
              with motivated candidates in a setting where you&apos;re at your
              best.
            </p>
          </EventCard>
          <EventCard
            title="After Work"
            image="/events/after-work.webp"
            imageAlt="Students and a company representative talking at an informal gathering"
            summary={
              <>
                <span>
                  <strong>Location: Your office or Nymble</strong>
                </span>
                <span>
                  <strong>Price: 9,300 / 12,400 SEK excl. VAT</strong>
                </span>
              </>
            }>
            <p>
              Keep the conversation going after the fair floor closes. Host
              students for an informal mixer — at your own office for a more
              personal touch, or let us set it up for you at Nymble, THS&apos;s
              own pub. Whether you prefer casual mingling or structured
              networking, this is a low-pressure environment where real
              connections happen.
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm">
              <li>
                <strong>At Nymble: 12,400 SEK</strong>
              </li>
              <li>
                <strong>At your office: 9,300 SEK</strong>
              </li>
            </ul>
          </EventCard>
          <EventCard
            title="Collaborative Events"
            image="/events/custom.webp"
            imageAlt="Participants gathering outdoors for a custom Armada event"
            summary={
              <>
                <span>Your concept, your way</span>
              </>
            }>
            <p>
              Have something more specific in mind? Design your own event — a
              workshop, live demo, hackathon, case competition, or anything else
              that reflects your brand. You bring the concept and the people; we
              handle the logistics and can arrange catering if needed.
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
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="mt-2 text-sm">
              Contact our events team for a quotation:{" "}
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
