"use client"

import { useShuffledItems } from "@/components/shared/hooks/useShuffledItems"
import { useCarouselRotation } from "@/components/shared/hooks/useCarouselRotation"
import { Button } from "@/components/ui/button"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { Page } from "@/components/shared/Page"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { shouldBypassNextImageOptimization } from "@/lib/utils"
import { Pause, Play } from "lucide-react"
import Image from "next/image"
import { useId, useLayoutEffect, useRef, useState } from "react"

interface GoldExhibitorsProps {
  exhibitors: Exhibitor[]
}

const getExhibitorId = (exhibitor: Exhibitor) => exhibitor.id

export default function GoldExhibitors({ exhibitors }: GoldExhibitorsProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set())
  const shuffledExhibitors = useShuffledItems(exhibitors, getExhibitorId)
  const visibleExhibitors = shuffledExhibitors ?? exhibitors
  const {
    api,
    selected,
    scrollSnaps,
    paused,
    pause,
    rotating,
    reducedMotion,
    toggleRotation,
    scrollTo,
    carouselProps
  } = useCarouselRotation({
    itemCount: visibleExhibitors.length,
    delay: 6000
  })
  const [carouselHeight, setCarouselHeight] = useState<number>()

  useLayoutEffect(() => {
    if (!api) return

    const updateHeight = () => {
      const slide = api.slideNodes()[api.selectedScrollSnap()]
      if (!slide) return
      const marginBottom = parseFloat(getComputedStyle(slide).marginBottom) || 0
      setCarouselHeight(slide.offsetHeight + marginBottom)
    }

    const observer = new ResizeObserver(updateHeight)
    api.slideNodes().forEach(slide => observer.observe(slide))
    api.on("select", updateHeight)
    api.on("reInit", updateHeight)
    updateHeight()

    return () => {
      observer.disconnect()
      api.off("select", updateHeight)
      api.off("reInit", updateHeight)
    }
  }, [api])

  return (
    <section className="w-full pt-8 pb-10">
      <Page.Header
        tier="secondary"
        className="text-licorice mx-auto mb-6 w-fit px-6 py-2 text-center text-4xl tracking-wide sm:text-5xl">
        Gold Exhibitors
      </Page.Header>

      <Carousel
        {...carouselProps}
        aria-label="Gold exhibitors"
        opts={{
          align: "center",
          loop: true,
          duration: reducedMotion ? 0 : 25
        }}
        className={`mx-auto w-full max-w-3xl select-none ${carouselHeight === undefined || !shuffledExhibitors ? "invisible" : ""}`}>
        <CarouselContent
          aria-live={rotating ? "off" : "polite"}
          className="items-start"
          style={{ height: carouselHeight }}>
          {visibleExhibitors.map(ex => (
            <CarouselItem key={ex.id} className="mb-1">
              <ExhibitorCard
                exhibitor={ex}
                expanded={expandedIds.has(ex.id)}
                onExpandedChange={expanded => {
                  if (expanded) pause()
                  setExpandedIds(previous => {
                    const next = new Set(previous)
                    if (expanded) next.add(ex.id)
                    else next.delete(ex.id)
                    return next
                  })
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {visibleExhibitors.length > 1 && !reducedMotion && (
          <Button
            type="button"
            variant="noShadow"
            size="icon"
            data-rotation-control
            className="text-licorice rounded-base before:rounded-base before:bg-snow/25 hover:before:bg-snow/90 focus-visible:before:bg-snow/90 absolute right-1 bottom-1 isolate size-11 cursor-pointer border-0 bg-transparent before:pointer-events-none before:absolute before:inset-2 before:-z-10 before:transition-colors before:duration-200 motion-reduce:before:transition-none sm:right-3 sm:bottom-3 sm:before:inset-1 [&_svg]:size-3.5 [&_svg]:drop-shadow-sm sm:[&_svg]:size-4"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            onClick={toggleRotation}>
            {paused ? (
              <Play aria-hidden="true" />
            ) : (
              <Pause aria-hidden="true" />
            )}
          </Button>
        )}
        <CarouselPrevious size="icon" className="bg-snow hidden sm:flex" />
        <CarouselNext size="icon" className="bg-snow hidden sm:flex" />
      </Carousel>

      {/* dot navigation */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === selected}
            onClick={() => scrollTo(idx)}
            className={`h-3 w-3 rounded-full transition motion-reduce:transition-none ${
              idx === selected
                ? "bg-pineapple scale-110"
                : "bg-pineapple/30 hover:bg-pineapple/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

function ExhibitorCard({
  exhibitor,
  expanded,
  onExpandedChange
}: {
  exhibitor: Exhibitor
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
}) {
  const [isLong, setIsLong] = useState(false)
  const [descriptionLines, setDescriptionLines] = useState(1)
  const descriptionId = useId()
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const descriptionSpaceRef = useRef<HTMLDivElement>(null)
  const about = exhibitor.about ?? ""
  const logoSrc = exhibitor.logoThumbnail ?? exhibitor.logoFreesize
  const shouldBypassLogoOptimization =
    shouldBypassNextImageOptimization(logoSrc)

  useLayoutEffect(() => {
    const description = descriptionRef.current
    const space = descriptionSpaceRef.current
    if (!description || !space || expanded) return

    const updateOverflow = () => {
      const lineHeight = parseFloat(getComputedStyle(description).lineHeight)
      const lines = Math.max(1, Math.floor(space.clientHeight / lineHeight))
      setDescriptionLines(lines)
      setIsLong(description.scrollHeight > lines * lineHeight)
    }
    const observer = new ResizeObserver(updateOverflow)
    observer.observe(space)
    observer.observe(description)
    updateOverflow()
    return () => observer.disconnect()
  }, [about, expanded])

  return (
    <Card
      className={`bg-pineapple mr-1 flex flex-col items-center rounded p-6 text-center transition motion-reduce:transition-none sm:p-8 ${expanded ? "" : "h-120 sm:h-104"}`}>
      <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-3">
        {logoSrc && (
          <div className="mb-2 flex shrink-0 justify-center">
            <Image
              src={logoSrc}
              alt={`${exhibitor.name} logo`}
              unoptimized={shouldBypassLogoOptimization}
              width={180}
              height={72}
              className="h-16 w-auto max-w-full object-contain"
            />
          </div>
        )}

        <h3 className="text-licorice mb-3 shrink-0 text-2xl font-semibold">
          {exhibitor.companyWebsite ? (
            <a
              href={exhibitor.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-snow underline-offset-4 transition hover:underline">
              {exhibitor.name}
            </a>
          ) : (
            exhibitor.name
          )}
        </h3>

        <div
          ref={descriptionSpaceRef}
          data-gold-description
          className={`mb-3 w-full max-w-prose ${expanded ? "" : "min-h-0 flex-1"}`}>
          <p
            ref={descriptionRef}
            id={descriptionId}
            style={expanded ? undefined : { WebkitLineClamp: descriptionLines }}
            className={`text-licorice text-sm leading-6 sm:text-base ${
              expanded
                ? ""
                : "[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical]"
            }`}>
            {about}
          </p>
        </div>

        <div className="min-h-5 shrink-0">
          {isLong && (
            <button
              aria-expanded={expanded}
              aria-controls={descriptionId}
              onClick={() => onExpandedChange(!expanded)}
              className="text-licorice hover:text-snow text-sm font-medium underline underline-offset-2 transition">
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
