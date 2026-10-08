"use client"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import { Pause, Play } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useSyncExternalStore } from "react"

const controlClassName =
  "isolate size-11 cursor-pointer rounded-base border-0 bg-transparent text-licorice before:pointer-events-none before:absolute before:inset-1 before:-z-10 before:rounded-base before:bg-snow/25 before:transition-colors before:duration-200 hover:before:bg-snow/90 focus-visible:before:bg-snow/90 motion-reduce:before:transition-none [&_svg]:drop-shadow-sm"

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
          <CarouselPrevious
            className={`${controlClassName} left-3 hidden sm:inline-flex`}
          />
          <CarouselNext
            className={`${controlClassName} right-3 hidden sm:inline-flex`}
          />
          <div
            className="bg-licorice/50 text-snow absolute bottom-3 left-1/2 hidden -translate-x-1/2 rounded-full px-3 py-1 text-sm sm:block"
            aria-hidden="true">
            {selected + 1} / {images.length}
          </div>
          <div
            className="absolute right-14 bottom-0 left-14 overflow-x-auto sm:hidden"
            role="group"
            aria-label="Choose photo">
            <div className="flex w-max min-w-full justify-center">
              {images.map((_, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="noShadow"
                  size="icon"
                  className="h-11 w-8 shrink-0 cursor-pointer items-end rounded-full border-0 bg-transparent pb-2"
                  aria-label={`Go to photo ${index + 1} of ${images.length}`}
                  aria-current={index === selected ? "true" : undefined}
                  disabled={!api}
                  onClick={() => {
                    setPaused(true)
                    api?.scrollTo(index)
                  }}>
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full shadow-sm transition-colors motion-reduce:transition-none ${index === selected ? "bg-snow" : "bg-snow/50"}`}
                  />
                </Button>
              ))}
            </div>
          </div>
          {!reducedMotion && (
            <Button
              type="button"
              variant="noShadow"
              size="icon"
              data-rotation-control
              className={`${controlClassName} absolute right-1 bottom-1 before:inset-2 sm:right-3 sm:bottom-3 sm:before:inset-1 [&_svg]:size-3.5 sm:[&_svg]:size-4`}
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
