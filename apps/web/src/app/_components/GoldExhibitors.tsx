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

import styles from "./GoldExhibitors.module.css"

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
  const [collapsedHeight, setCollapsedHeight] = useState<number>()
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

    const collapsedHeights = new Map<HTMLElement, number>()
    const updateHeight = () => {
      for (const slide of api.slideNodes()) {
        const card = slide.querySelector<HTMLElement>('[data-slot="card"]')
        const content = slide.querySelector<HTMLElement>("[data-gold-content]")
        if (!card || !content || card.dataset.expanded === "true") continue
        const css = getComputedStyle(card)
        collapsedHeights.set(
          slide,
          Math.ceil(
            content.getBoundingClientRect().height +
              parseFloat(css.paddingTop) +
              parseFloat(css.paddingBottom) +
              parseFloat(css.borderTopWidth) +
              parseFloat(css.borderBottomWidth)
          )
        )
      }
      setCollapsedHeight(Math.max(0, ...collapsedHeights.values()))
      const slide = api.slideNodes()[api.selectedScrollSnap()]
      if (!slide) return
      const marginBottom = parseFloat(getComputedStyle(slide).marginBottom) || 0
      setCarouselHeight(slide.offsetHeight + marginBottom)
    }

    const observer = new ResizeObserver(updateHeight)
    api.slideNodes().forEach(slide => {
      observer.observe(slide)
      const content = slide.querySelector<HTMLElement>("[data-gold-content]")
      if (content) observer.observe(content)
    })
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
        className={`${styles.goldHeading} mx-auto mb-6 w-fit px-6 py-2 text-center text-4xl tracking-wide sm:text-5xl`}>
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
              <ExhibitorCard exhibitor={ex} collapsedHeight={collapsedHeight} />
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

function ExhibitorCard({
  exhibitor,
  collapsedHeight
}: {
  exhibitor: Exhibitor
  collapsedHeight?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const descriptionId = useId()
  const [maxLength, setMaxLength] = useState(350)
  const logoSrc = exhibitor.logoThumbnail ?? exhibitor.logoFreesize
  const shouldBypassLogoOptimization =
    shouldBypassNextImageOptimization(logoSrc)

  useEffect(() => {
    const updateLength = () => {
      if (window.innerWidth < 640) setMaxLength(220)
      else if (window.innerWidth < 1024) setMaxLength(350)
      else setMaxLength(500)
    }
    updateLength()
    window.addEventListener("resize", updateLength)
    return () => window.removeEventListener("resize", updateLength)
  }, [])

  const about = exhibitor.about ?? ""
  const isLong = about.length > maxLength
  const displayedText = expanded
    ? about
    : about.slice(0, maxLength) + (isLong ? "..." : "")

  return (
    <Card
      data-expanded={expanded}
      style={{ minHeight: collapsedHeight }}
      className="bg-pineapple mr-1 flex flex-col items-center rounded p-6 text-center transition sm:p-8">
      <div
        data-gold-content
        className="flex w-full flex-col items-center gap-3">
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
          id={descriptionId}
          className="text-licorice mb-3 max-w-prose text-sm leading-relaxed sm:text-base">
          {displayedText}
        </p>

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
    </Card>
  )
}
