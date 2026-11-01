"use client"

import type { CarouselApi } from "@/components/ui/carousel"
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type TouchEvent,
  type PointerEvent
} from "react"

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"
const subscribeToMotion = (callback: () => void) => {
  const query = window.matchMedia(reducedMotionQuery)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

export function useCarouselRotation({
  itemCount,
  delay = 5000
}: {
  itemCount: number
  delay?: number
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const gestureStart = useRef<{ x: number; y: number } | null>(null)
  const trackGesture = (x: number, y: number) => {
    const start = gestureStart.current
    if (!start) return
    const horizontal = Math.abs(x - start.x)
    const vertical = Math.abs(y - start.y)
    if (Math.max(horizontal, vertical) < 8) return
    // Lock the gesture's intent once it exceeds normal touch jitter.
    gestureStart.current = null
    if (horizontal > vertical) setPaused(true)
  }
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true
  )
  const rotating = itemCount > 1 && !paused && !hovered && !reducedMotion

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    const onReInit = () => {
      setScrollSnaps(api.scrollSnapList())
      onSelect()
    }
    onReInit()
    api.on("select", onSelect)
    api.on("reInit", onReInit)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onReInit)
    }
  }, [api])

  useEffect(() => {
    if (!api || !rotating) return
    const timer = window.setInterval(() => {
      if (!document.hidden) api.scrollNext()
    }, delay)
    return () => window.clearInterval(timer)
  }, [api, rotating, delay])

  return {
    api,
    selected,
    scrollSnaps,
    paused: !rotating,
    rotating,
    reducedMotion,
    pause: () => setPaused(true),
    toggleRotation: () => {
      setPaused(rotating)
      // An explicit play action overrides the current hover pause.
      setHovered(false)
    },
    scrollTo: (index: number) => {
      setPaused(true)
      api?.scrollTo(index)
    },
    carouselProps: {
      setApi,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false)
        gestureStart.current = null
      },
      onTouchStart: (event: TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0]
        gestureStart.current =
          event.touches.length === 1 && touch
            ? { x: touch.clientX, y: touch.clientY }
            : null
      },
      onTouchMove: (event: TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0]
        if (event.touches.length === 1 && touch)
          trackGesture(touch.clientX, touch.clientY)
        else gestureStart.current = null
      },
      onTouchEnd: () => {
        gestureStart.current = null
      },
      onTouchCancel: () => {
        gestureStart.current = null
      },
      onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "touch" && event.button === 0)
          gestureStart.current = { x: event.clientX, y: event.clientY }
      },
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "touch")
          trackGesture(event.clientX, event.clientY)
      },
      onPointerUp: () => {
        gestureStart.current = null
      },
      onPointerCancel: () => {
        gestureStart.current = null
      },
      onFocusCapture: (event: FocusEvent<HTMLDivElement>) => {
        if (!(event.target as HTMLElement).closest("[data-rotation-control]"))
          setPaused(true)
      }
    }
  }
}
