"use client"

import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { Page } from "@/components/shared/Page"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import { shouldBypassNextImageOptimization } from "@/lib/utils"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"

interface GoldExhibitorsProps {
  exhibitors: Exhibitor[]
}

export default function GoldExhibitors({ exhibitors }: GoldExhibitorsProps) {
  const plugin = useRef(
    Autoplay({
      delay: 6000,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  )

  const [api, setApi] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [carouselHeight, setCarouselHeight] = useState<number>()
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  useEffect(() => {
    if (!api) return

    const handleSelect = () => setSelectedIndex(api.selectedScrollSnap())

    setScrollSnaps(api.scrollSnapList())
    api.on("select", handleSelect)

    // ✅ Return void-cleanup function
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

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

  const visibleExhibitors = exhibitors.slice(0, 8)

  return (
    <section className="w-full pt-8 pb-10">
      <Page.Header
        tier="secondary"
        className="text-licorice mx-auto mb-6 w-fit px-6 py-2 text-center text-4xl tracking-wide sm:text-5xl">
        Gold Exhibitors
      </Page.Header>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: "center",
          loop: true
        }}
        className="mx-auto w-full max-w-3xl select-none">
        <CarouselContent
          className="items-start"
          style={{ height: carouselHeight }}>
          {visibleExhibitors.map(ex => (
            <CarouselItem key={ex.id} className="mb-1">
              <ExhibitorCard exhibitor={ex} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious size="icon" className="bg-snow hidden sm:flex" />
        <CarouselNext size="icon" className="bg-snow hidden sm:flex" />
      </Carousel>

      {/* dot navigation */}
      <div className="mt-4 flex justify-center gap-2">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === selectedIndex}
            onClick={() => api?.scrollTo(idx)}
            className={`h-3 w-3 rounded-full transition ${
              idx === selectedIndex
                ? "bg-pineapple scale-110"
                : "bg-pineapple/30 hover:bg-pineapple/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

function ExhibitorCard({ exhibitor }: { exhibitor: Exhibitor }) {
  const [expanded, setExpanded] = useState(false)
  const [isLong, setIsLong] = useState(false)
  const descriptionId = useId()
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const about = exhibitor.about ?? ""
  const logoSrc = exhibitor.logoThumbnail ?? exhibitor.logoFreesize
  const shouldBypassLogoOptimization =
    shouldBypassNextImageOptimization(logoSrc)

  useLayoutEffect(() => {
    const description = descriptionRef.current
    if (!description || expanded) return

    const updateOverflow = () => {
      setIsLong(description.scrollHeight > description.clientHeight)
    }
    const observer = new ResizeObserver(updateOverflow)
    observer.observe(description)
    updateOverflow()
    return () => observer.disconnect()
  }, [about, expanded])

  return (
    <Card className="bg-pineapple mr-1 flex flex-col items-center rounded p-6 text-center transition sm:p-8">
      <div className="flex w-full flex-col items-center gap-3">
        {logoSrc && (
          <div className="mb-2 flex justify-center">
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

        <h3 className="text-licorice mb-3 text-2xl font-semibold">
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

        <p
          ref={descriptionRef}
          id={descriptionId}
          className={`text-licorice mb-3 w-full max-w-prose text-sm leading-6 sm:text-base ${
            expanded ? "" : "line-clamp-6 h-36"
          }`}>
          {about}
        </p>

        <div className="min-h-5">
          {isLong && (
            <button
              aria-expanded={expanded}
              aria-controls={descriptionId}
              onClick={() => setExpanded(prev => !prev)}
              className="text-licorice hover:text-snow text-sm font-medium underline underline-offset-2 transition">
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
