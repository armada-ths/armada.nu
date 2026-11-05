"use client"

import { cn } from "@armada/shared/cn"
import { mergeOrder, neighborId, type Direction } from "@photos/lib/slideshow"
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Pause,
  Play,
  X
} from "lucide-react"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from "react"
import "./slideshow.css"

export type SlidePhoto = {
  id: number
  url: string
  width: number
  height: number
}

export type SlideshowProps = {
  /** Gallery photos, newest first. May grow while the slideshow is open. */
  photos: readonly SlidePhoto[]
  startId: number
  /** Time each photo takes to drift past the centre; the strip never stops moving while playing. */
  intervalMs?: number
  /** Time a manual step (buttons, keys, swipes) takes to settle. */
  transitionMs?: number
  onClose: () => void
}

// `track` is the slide index of the centred photo; it keys the slides so they keep moving instead of remounting.
type View = { id: number | null; track: number }

// Animated outside React state so motion never waits on a render.
type Motion = {
  drift: number
  spring: number
  velocity: number
  target: number
}

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitFullscreenEnabled?: boolean
  webkitExitFullscreen?: () => Promise<void> | void
}

const CONTROLS_IDLE_MS = 3000
const PRELOAD_TIMEOUT_MS = 4000
const SWIPE_DISTANCE_PX = 50
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
// Neighbour distance in slide widths; below 100 so it tucks behind the current photo.
const SLIDE_STEP_PERCENT = 82
const SLIDES_EACH_SIDE = 3
const MAX_QUEUED_STEPS = 4

const preloaded = new Map<string, Promise<boolean>>()

function loadImage(url: string): Promise<boolean> {
  const cached = preloaded.get(url)
  if (cached) return cached
  const promise = new Promise<boolean>(resolve => {
    const image = new Image()
    image.onload = () => {
      // Decoding ahead of time avoids a visible pop-in when the slide starts.
      const decoded = image.decode ? image.decode() : Promise.resolve()
      decoded.then(
        () => resolve(true),
        () => resolve(true)
      )
    }
    image.onerror = () => resolve(false)
    image.src = url
  })
  preloaded.set(url, promise)
  void promise.then(ok => {
    if (!ok) preloaded.delete(url)
  })
  if (preloaded.size > 24) {
    const oldest = preloaded.keys().next().value
    if (oldest !== undefined) preloaded.delete(oldest)
  }
  return promise
}

// A slow photo must not stall the show; it fades in whenever it arrives.
function loadImageWithTimeout(url: string): Promise<boolean> {
  return new Promise(resolve => {
    const timer = window.setTimeout(() => resolve(true), PRELOAD_TIMEOUT_MS)
    void loadImage(url).then(ok => {
      window.clearTimeout(timer)
      resolve(ok)
    })
  })
}

const subscribeToMotion = (callback: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches

const fullscreenElement = () =>
  document.fullscreenElement ??
  (document as FullscreenDocument).webkitFullscreenElement ??
  null

function requestFullscreen(element: HTMLElement | null) {
  if (!element) return
  const target = element as FullscreenElement
  try {
    const request = target.requestFullscreen ?? target.webkitRequestFullscreen
    void Promise.resolve(request?.call(target)).catch(() => {})
  } catch {
    // Unsupported or blocked: the fixed overlay is the fallback.
  }
}

function exitFullscreen() {
  const doc = document as FullscreenDocument
  try {
    const exit = doc.exitFullscreen ?? doc.webkitExitFullscreen
    void Promise.resolve(exit?.call(doc)).catch(() => {})
  } catch {
    // Already out of fullscreen.
  }
}

// `distance` is the slide's continuous offset from the centre, so scale and fade vary smoothly with it.
function placeSlide(element: HTMLElement, distance: number) {
  const away = Math.abs(distance)
  const near = Math.min(away, 1)
  const focus = 1 - near * near * (3 - 2 * near)
  const far = Math.min(Math.max(away - 1, 0), 1)
  const scale = 0.8 + 0.45 * focus - 0.1 * far
  element.style.transform = `translate3d(${-50 + distance * SLIDE_STEP_PERCENT}%, 0, 0) scale(${scale})`
  element.style.opacity = String((0.45 + 0.55 * focus) * (1 - far))
  element.style.zIndex = String(100 - Math.round(away * 10))
}

function SlideImage({
  photo,
  label,
  onBroken
}: {
  photo: SlidePhoto
  label: string
  onBroken: (id: number) => void
}) {
  const [broken, setBroken] = useState(false)
  if (broken)
    return (
      <p className="grid h-full place-items-center text-white/60">
        This photo could not be loaded.
      </p>
    )
  return (
    <img
      src={photo.url}
      alt={label}
      width={photo.width || undefined}
      height={photo.height || undefined}
      decoding="async"
      draggable={false}
      className="h-full w-full object-contain"
      onError={() => {
        setBroken(true)
        onBroken(photo.id)
      }}
    />
  )
}

function Slide({
  photo,
  track,
  offset,
  label,
  register,
  onBroken,
  onSelect
}: {
  photo: SlidePhoto
  track: number
  offset: number
  label: string
  register: (track: number, element: HTMLElement | null) => void
  onBroken: (id: number) => void
  onSelect: (offset: number) => void
}) {
  return (
    <div
      ref={element => register(track, element)}
      className="slideshow-slide"
      aria-hidden={offset !== 0 || undefined}
      onClick={
        Math.abs(offset) === 1
          ? event => {
              event.stopPropagation()
              onSelect(offset)
            }
          : undefined
      }>
      <SlideImage
        key={photo.id}
        photo={photo}
        label={label}
        onBroken={onBroken}
      />
    </div>
  )
}

const iconButton =
  "grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white 2xl:h-16 2xl:w-16"

export function Slideshow({
  photos,
  startId,
  intervalMs = 11000,
  transitionMs = 2000,
  onClose
}: SlideshowProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    getReducedMotion,
    () => false
  )
  const duration = reducedMotion ? Math.min(transitionMs, 500) : transitionMs

  const byId = useMemo(
    () => new Map(photos.map(photo => [photo.id, photo])),
    [photos]
  )
  const [order, setOrder] = useState(() => photos.map(photo => photo.id))
  const [seenPhotos, setSeenPhotos] = useState(photos)
  const [view, setView] = useState<View>(() => ({
    id: photos.some(photo => photo.id === startId)
      ? startId
      : (photos[0]?.id ?? null),
    track: 0
  }))
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [, setFailedTick] = useState(0)
  const [fullscreenSupported] = useState(
    () =>
      document.fullscreenEnabled ||
      Boolean((document as FullscreenDocument).webkitFullscreenEnabled)
  )

  // Photos arrive while the show runs: older pages join the loop, new uploads follow the slides on screen.
  let currentOrder = order
  if (photos !== seenPhotos) {
    let ahead = view.id
    for (let step = 0; step < SLIDES_EACH_SIDE && ahead !== null; step++)
      ahead = neighborId(order, ahead, 1) ?? ahead
    currentOrder = mergeOrder(
      order,
      photos.map(photo => photo.id),
      ahead
    )
    setSeenPhotos(photos)
    setOrder(currentOrder)
  }
  const currentValid = view.id !== null && byId.has(view.id)
  if (!currentValid && (currentOrder[0] ?? null) !== view.id) {
    setView(previous => ({ ...previous, id: currentOrder[0] ?? null }))
  }
  const total = currentOrder.length
  const multiple = total > 1

  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef(view)
  const orderRef = useRef(order)
  const byIdRef = useRef(byId)
  const failedRef = useRef(new Set<number>())
  const hideTimerRef = useRef<number | null>(null)
  const motionRef = useRef<Motion>({
    drift: 0,
    spring: 0,
    velocity: 0,
    target: 0
  })
  const slideElementsRef = useRef(new Map<number, HTMLElement>())
  const playingRef = useRef(playing)
  const onCloseRef = useRef(onClose)
  const keepOpenOnExitRef = useRef(false)
  const wasFullscreenRef = useRef(false)
  const lastPointerTypeRef = useRef("mouse")
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null)
  const swipedRef = useRef(false)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])
  useEffect(() => {
    viewRef.current = view
  }, [view])
  useEffect(() => {
    playingRef.current = playing
  }, [playing])
  useEffect(() => {
    orderRef.current = order
    byIdRef.current = byId
    failedRef.current.clear()
  }, [order, byId])

  // Steps accumulate and a spring eases the strip there, so quick repeats never queue or race.
  const navigate = useCallback((direction: Direction) => {
    if (orderRef.current.length < 2) return
    const motion = motionRef.current
    motion.target = Math.max(
      motion.spring - MAX_QUEUED_STEPS,
      Math.min(motion.spring + MAX_QUEUED_STEPS, motion.target + direction)
    )
  }, [])

  const registerSlide = useCallback(
    (track: number, element: HTMLElement | null) => {
      if (!element) {
        slideElementsRef.current.delete(track)
        return
      }
      slideElementsRef.current.set(track, element)
      const motion = motionRef.current
      placeSlide(element, track - (motion.drift + motion.spring))
    },
    []
  )
  const reveal = useCallback(() => {
    setControlsVisible(true)
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(
      () => setControlsVisible(false),
      CONTROLS_IDLE_MS
    )
  }, [])

  const togglePlaying = useCallback(() => setPlaying(value => !value), [])

  const toggleFullscreen = useCallback(() => {
    if (fullscreenElement()) {
      keepOpenOnExitRef.current = true
      exitFullscreen()
    } else {
      requestFullscreen(containerRef.current)
    }
  }, [])

  const handleBroken = useCallback((id: number) => {
    failedRef.current.add(id)
    setFailedTick(tick => tick + 1)
  }, [])

  // Mount/unmount: focus, scroll lock and wake lock.
  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    containerRef.current?.focus()
    reveal()

    let wakeLock: WakeLockSentinel | null = null
    let cancelled = false
    const acquireWakeLock = async () => {
      if (wakeLock && !wakeLock.released) return
      try {
        wakeLock = (await navigator.wakeLock?.request("screen")) ?? null
        if (cancelled) void wakeLock?.release().catch(() => {})
      } catch {
        // Not supported or denied: the screen may dim, which is not fatal.
      }
    }
    const onVisibility = () => {
      if (document.visibilityState === "visible") void acquireWakeLock()
    }
    void acquireWakeLock()
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelled = true
      if (hideTimerRef.current !== null)
        window.clearTimeout(hideTimerRef.current)
      document.removeEventListener("visibilitychange", onVisibility)
      void wakeLock?.release().catch(() => {})
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus()
    }
  }, [reveal])

  // Fullscreen: enter on open, leave on close; leaving with Esc closes the show.
  useEffect(() => {
    const onChange = () => {
      const active = fullscreenElement() !== null
      setIsFullscreen(active)
      if (active) {
        wasFullscreenRef.current = true
        return
      }
      if (!wasFullscreenRef.current) return
      wasFullscreenRef.current = false
      if (keepOpenOnExitRef.current) keepOpenOnExitRef.current = false
      else onCloseRef.current()
    }
    document.addEventListener("fullscreenchange", onChange)
    document.addEventListener("webkitfullscreenchange", onChange)
    requestFullscreen(containerRef.current)
    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      document.removeEventListener("webkitfullscreenchange", onChange)
      wasFullscreenRef.current = false
      if (fullscreenElement()) exitFullscreen()
    }
  }, [])

  // First photo: wait for it so the show opens without a half-loaded image.
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const id = viewRef.current.id
      const photo = id === null ? undefined : byIdRef.current.get(id)
      if (id !== null && photo && !(await loadImageWithTimeout(photo.url))) {
        failedRef.current.add(id)
        const alternative = neighborId(
          orderRef.current,
          id,
          1,
          failedRef.current
        )
        if (alternative !== null && !cancelled) {
          viewRef.current = { ...viewRef.current, id: alternative }
          setView(viewRef.current)
        }
      }
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Keep the photos about to scroll in decoded so slides never wait on the network.
  useEffect(() => {
    if (view.id === null) return
    const upcoming: number[] = []
    let cursor = view.id
    for (let step = 0; step < SLIDES_EACH_SIDE + 2; step++) {
      const next = neighborId(order, cursor, 1)
      if (next === null) break
      upcoming.push(next)
      cursor = next
    }
    const previous = neighborId(order, view.id, -1)
    if (previous !== null) upcoming.push(previous)
    for (const id of upcoming) {
      const photo = byId.get(id)
      if (!photo) continue
      void loadImage(photo.url).then(ok => {
        if (ok || failedRef.current.has(id)) return
        // A broken neighbour must not be shown beside the current photo.
        failedRef.current.add(id)
        setFailedTick(tick => tick + 1)
      })
    }
  }, [view.id, order, byId])

  // Frame loop: the strip drifts at a constant speed and manual steps ease on top of that.
  useEffect(() => {
    if (!ready) return
    const motion = motionRef.current
    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const elapsed = Math.min(now - last, 50)
      last = now
      const multi = orderRef.current.length > 1

      if (!reducedMotion && playingRef.current && multi)
        motion.drift += elapsed / intervalMs

      if (reducedMotion) {
        motion.spring = motion.target
        motion.velocity = 0
      } else {
        // Critically damped: eases in and out and can be re-aimed mid-flight.
        const omega = 5.8 / (duration / 1000)
        const substeps = Math.max(1, Math.ceil(elapsed / 8))
        const dt = elapsed / 1000 / substeps
        for (let step = 0; step < substeps; step++) {
          motion.velocity +=
            (-2 * omega * motion.velocity -
              omega * omega * (motion.spring - motion.target)) *
            dt
          motion.spring += motion.velocity * dt
        }
        if (
          Math.abs(motion.spring - motion.target) < 0.0005 &&
          Math.abs(motion.velocity) < 0.001
        ) {
          motion.spring = motion.target
          motion.velocity = 0
        }
      }

      const position = motion.drift + motion.spring
      slideElementsRef.current.forEach((element, track) =>
        placeSlide(element, track - position)
      )

      const track = Math.round(position)
      const current = viewRef.current
      if (multi && current.id !== null && track !== current.track) {
        const direction = track > current.track ? 1 : -1
        let id = current.id
        for (let step = current.track; step !== track; step += direction)
          id =
            neighborId(orderRef.current, id, direction, failedRef.current) ?? id
        viewRef.current = { id, track }
        setView(viewRef.current)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [ready, reducedMotion, duration, intervalMs])

  // Reduced motion replaces the drift with a photo change every interval.
  useEffect(() => {
    if (!reducedMotion || !playing || !ready || !multiple) return
    const timer = window.setInterval(() => navigate(1), intervalMs)
    return () => window.clearInterval(timer)
  }, [reducedMotion, playing, ready, multiple, intervalMs, navigate])

  // Pausing lets the strip settle on the nearest photo instead of freezing between two.
  useEffect(() => {
    if (playing) return
    const motion = motionRef.current
    const position = motion.drift + motion.spring
    const final = position + (motion.target - motion.spring)
    motion.target = motion.spring + (Math.round(final) - position)
  }, [playing])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          /^(input|textarea|select)$/i.test(target.tagName))
      )
        return

      switch (event.key) {
        case "ArrowRight":
        case "ArrowLeft":
          event.preventDefault()
          reveal()
          void navigate(event.key === "ArrowRight" ? 1 : -1)
          break
        case " ":
        case "Spacebar":
          // A focused button already toggles on Space.
          if (target instanceof HTMLButtonElement) return
          event.preventDefault()
          reveal()
          togglePlaying()
          break
        case "Escape":
          event.preventDefault()
          onCloseRef.current()
          break
        case "f":
        case "F":
          event.preventDefault()
          reveal()
          toggleFullscreen()
          break
        case "Tab": {
          const container = containerRef.current
          const focusable = container?.querySelectorAll<HTMLElement>(
            "button:not([disabled])"
          )
          if (!container || !focusable || focusable.length === 0) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          const active = document.activeElement
          if (!container.contains(active) || active === container) {
            event.preventDefault()
            ;(event.shiftKey ? last : first).focus()
          } else if (event.shiftKey && active === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && active === last) {
            event.preventDefault()
            first.focus()
          }
          break
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [navigate, reveal, toggleFullscreen, togglePlaying])

  const current = view.id === null ? undefined : byId.get(view.id)
  const position = view.id === null ? 0 : currentOrder.indexOf(view.id) + 1
  const label = `Photo ${position} of ${total}`

  // The centred photo plus the neighbours either side, keyed by track so they keep moving across renders.
  const slides: { track: number; photo: SlidePhoto }[] = []
  if (current) {
    slides.push({ track: view.track, photo: current })
    const reach = multiple ? SLIDES_EACH_SIDE : 0
    for (const direction of [1, -1] as const) {
      let cursor = current.id
      for (let step = 1; step <= reach; step++) {
        const next = neighborId(
          currentOrder,
          cursor,
          direction,
          failedRef.current
        )
        const photo = next === null ? undefined : byId.get(next)
        if (next === null || !photo) break
        slides.push({ track: view.track + direction * step, photo })
        cursor = next
      }
    }
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo slideshow"
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-50 overflow-hidden bg-black text-white outline-none select-none",
        !controlsVisible && "cursor-none"
      )}
      onPointerMove={event => {
        if (event.pointerType === "mouse") reveal()
      }}
      onFocusCapture={reveal}>
      <div
        className="absolute inset-0 isolate touch-none"
        onPointerDown={event => {
          lastPointerTypeRef.current = event.pointerType
          swipeStartRef.current = { x: event.clientX, y: event.clientY }
          swipedRef.current = false
        }}
        onPointerUp={event => {
          const start = swipeStartRef.current
          swipeStartRef.current = null
          if (!start) return
          const dx = event.clientX - start.x
          const dy = event.clientY - start.y
          if (
            Math.abs(dx) >= SWIPE_DISTANCE_PX &&
            Math.abs(dx) > Math.abs(dy) * 1.5
          ) {
            swipedRef.current = true
            reveal()
            void navigate(dx < 0 ? 1 : -1)
          }
        }}
        onPointerCancel={() => {
          swipeStartRef.current = null
        }}
        onClick={() => {
          if (swipedRef.current) {
            swipedRef.current = false
            return
          }
          if (!controlsVisible) reveal()
          else if (lastPointerTypeRef.current !== "mouse")
            setControlsVisible(false)
        }}>
        {ready && current && (
          <div className="slideshow-track absolute inset-0">
            {slides.map(slide => (
              <Slide
                key={slide.track}
                photo={slide.photo}
                track={slide.track}
                offset={slide.track - view.track}
                label={slide.track === view.track ? label : ""}
                register={registerSlide}
                onBroken={handleBroken}
                onSelect={offset => {
                  reveal()
                  navigate(offset > 0 ? 1 : -1)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {!ready && (
        <div
          role="status"
          aria-label="Loading photo"
          className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      )}

      {ready && !current && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-8 text-center text-lg text-white/70">
          No photos to show yet.
        </div>
      )}

      <div
        className={cn(
          "transition-opacity duration-500",
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
        )}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/60 to-transparent" />

        <div className="absolute top-0 right-0 flex gap-3 p-4 sm:p-6">
          {fullscreenSupported && (
            <button
              type="button"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className={iconButton}
              onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize aria-hidden="true" size={22} />
              ) : (
                <Maximize aria-hidden="true" size={22} />
              )}
            </button>
          )}
          <button
            type="button"
            aria-label="Close slideshow"
            className={iconButton}
            onClick={() => onCloseRef.current()}>
            <X aria-hidden="true" size={24} />
          </button>
        </div>

        {multiple && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              className={cn(
                iconButton,
                "absolute top-1/2 left-4 -translate-y-1/2 sm:left-6"
              )}
              onClick={() => void navigate(-1)}>
              <ChevronLeft aria-hidden="true" size={28} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              className={cn(
                iconButton,
                "absolute top-1/2 right-4 -translate-y-1/2 sm:right-6"
              )}
              onClick={() => void navigate(1)}>
              <ChevronRight aria-hidden="true" size={28} />
            </button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {multiple && (
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              className={iconButton}
              onClick={togglePlaying}>
              {playing ? (
                <Pause aria-hidden="true" size={22} />
              ) : (
                <Play aria-hidden="true" size={22} />
              )}
            </button>
          )}
          {current && (
            <p
              data-testid="slideshow-counter"
              className="rounded-full bg-white/10 px-4 py-2 text-sm tabular-nums backdrop-blur-md 2xl:px-6 2xl:py-3 2xl:text-lg">
              {position} / {total}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
