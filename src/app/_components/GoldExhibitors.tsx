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
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

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

  const visibleExhibitors = exhibitors.slice(0, 8)

  return (
    <section className="w-full py-16">
      {/* gold glow */}
      <Page.Header className="text-pineapple relative mb-16 text-center text-3xl tracking-wide">
        Gold Exhibitors
      </Page.Header>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: "center",
          loop: true
        }}
        className="w-full select-none">
        <CarouselContent>
          {visibleExhibitors.map((ex, index) => (
            <CarouselItem key={index} className="mb-1">
              <ExhibitorCard exhibitor={ex} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious size="icon" className="bg-snow hidden sm:flex" />
        <CarouselNext size="icon" className="bg-snow hidden sm:flex" />
      </Carousel>

      {/* dot navigation */}
      <div className="mt-8 flex justify-center gap-2">
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
  const [maxLength, setMaxLength] = useState(600)

  useEffect(() => {
    const updateLength = () => {
      if (window.innerWidth < 640) setMaxLength(300)
      else if (window.innerWidth < 1024) setMaxLength(600)
      else setMaxLength(800)
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
    <Card className="bg-pineapple mr-1 flex h-full flex-col items-center rounded p-8 text-center transition sm:p-10">
      {exhibitor.logoFreesize && (
        <div className="mb-6 flex justify-center">
          <Image
            src={exhibitor.logoFreesize}
            alt={`${exhibitor.name} logo`}
            width={200}
            height={90}
            className="h-20 object-contain"
          />
        </div>
      )}

      <h3 className="mb-3 text-2xl font-semibold text-black">
        {exhibitor.companyWebsite ? (
          <a
            href={exhibitor.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition hover:text-white hover:underline">
            {exhibitor.name}
          </a>
        ) : (
          exhibitor.name
        )}
      </h3>

      <p className="mb-3 max-w-prose text-sm leading-relaxed text-black sm:text-base">
        {displayedText}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="text-sm font-medium text-black underline underline-offset-2 transition hover:text-white">
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </Card>
  )
}
