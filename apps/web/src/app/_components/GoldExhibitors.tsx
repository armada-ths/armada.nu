"use client"
import { useLocale, useTranslations } from "next-intl"
import { normalizeLocale, localizedText } from "@armada/shared/i18n/routing"
import { LocalizedText } from "@/i18n/text"

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
import { useEffect, useRef, useState } from "react"

interface GoldExhibitorsProps {
  exhibitors: Exhibitor[]
}

export default function GoldExhibitors({ exhibitors }: GoldExhibitorsProps) {
  const accessibleT = useTranslations("Accessibility")
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
      <Page.Header
        tier="secondary"
        className="text-pineapple relative mb-16 text-center text-3xl tracking-wide">
        <LocalizedText id="goldExhibitors" />
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
            aria-label={accessibleT("goToSlide", { index: idx + 1 })}
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
  const locale = normalizeLocale(useLocale())
  const accessibleT = useTranslations("Accessibility")
  const [expanded, setExpanded] = useState(false)
  const [maxLength, setMaxLength] = useState(600)
  const shouldBypassLogoOptimization = shouldBypassNextImageOptimization(
    exhibitor.logoFreesize
  )

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

  const about = localizedText(locale, exhibitor.about, exhibitor.aboutSv) ?? ""
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
            alt={accessibleT("companyLogo", { name: exhibitor.name })}
            unoptimized={shouldBypassLogoOptimization}
            width={200}
            height={90}
            className="h-20 object-contain"
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

      <p className="text-licorice mb-3 max-w-prose text-sm leading-relaxed sm:text-base">
        {displayedText}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="text-licorice hover:text-snow text-sm font-medium underline underline-offset-2 transition">
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </Card>
  )
}
