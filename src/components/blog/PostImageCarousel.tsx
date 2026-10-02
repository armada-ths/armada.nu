"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"
const subscribeToMotion = (callback: () => void) => {
  const query = window.matchMedia(reducedMotionQuery)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

export function PostImageCarousel({
  images,
  title
}: {
  images: string[]
  title: string
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true
  )
  const rotating = images.length > 1 && !paused && !hovered && !reducedMotion

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api || !rotating) return
    const timer = window.setInterval(() => {
      if (!document.hidden) api.scrollNext()
    }, 5000)
    return () => window.clearInterval(timer)
  }, [api, rotating])

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true, duration: reducedMotion ? 0 : 25 }}
      className="-mt-6 w-full overflow-hidden"
      aria-label={`${title} photos`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => {
        if (!(event.target as HTMLElement).closest("[data-rotation-control]"))
          setPaused(true)
      }}>
      <CarouselContent className="ml-0" aria-live={rotating ? "off" : "polite"}>
        {images.map((src, index) => (
          <CarouselItem
            key={`${src}-${index}`}
            className="relative aspect-2/1 pl-0"
            aria-label={`${index + 1} of ${images.length}`}
            aria-hidden={index !== selected}>
            <Image
              src={src}
              alt={images.length > 1 ? `${title} — photo ${index + 1}` : title}
              fill
              className="object-cover"
              sizes="(max-width: 1000px) 100vw, 1000px"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="bg-snow text-licorice left-3 size-11" />
          <CarouselNext className="bg-snow text-licorice right-3 size-11" />
          <div
            className="bg-licorice/80 text-snow absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm"
            aria-hidden="true">
            {selected + 1} / {images.length}
          </div>
          {!reducedMotion && (
            <Button
              type="button"
              variant="noShadow"
              size="icon"
              data-rotation-control
              className="bg-snow text-licorice absolute right-3 bottom-3 size-11"
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              onClick={() => setPaused(value => !value)}>
              {paused ? (
                <Play aria-hidden="true" />
              ) : (
                <Pause aria-hidden="true" />
              )}
            </Button>
          )}
        </>
      )}
    </Carousel>
  )
}
