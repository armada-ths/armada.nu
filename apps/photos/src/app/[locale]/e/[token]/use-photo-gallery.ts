import {
  photoAPIError,
  photoErrorCode,
  type PhotoErrorCode
} from "@photos/lib/photoErrors"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  usePhotoLinks,
  type RenewedPhotoLinks
} from "@photos/lib/usePhotoLinks"
import type { PhotoGridHandle } from "./photo-grid"
import type { Photo, Gallery } from "./photo-types"

export function usePhotoGallery({
  base,
  active,
  galleryOpen
}: {
  base: string
  active: boolean
  galleryOpen: boolean
}) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [visibleIDs, setVisibleIDs] = useState<number[]>([])
  const [cursor, setCursor] = useState("")
  const [selected, setSelected] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [galleryBusy, setGalleryBusy] = useState(false)
  const [error, setError] = useState<PhotoErrorCode | null>(null)
  const gridRef = useRef<PhotoGridHandle>(null)
  const photosRef = useRef<Photo[]>([])
  const galleryBusyRef = useRef(false)

  const fetchGallery = useCallback(
    async (nextCursor = "") => {
      if (galleryBusyRef.current) return
      galleryBusyRef.current = true
      setGalleryBusy(true)
      try {
        const query = nextCursor
          ? `?cursor=${encodeURIComponent(nextCursor)}&limit=48`
          : "?limit=48"
        const response = await fetch(`${base}/gallery${query}`, {
          cache: "no-store"
        })
        if (!response.ok) throw photoAPIError(response)
        const page = (await response.json()) as Gallery
        setPhotos(previous => {
          const next = nextCursor
            ? [
                ...previous,
                ...page.items.filter(
                  photo => !previous.some(existing => existing.id === photo.id)
                )
              ]
            : page.items
          photosRef.current = next
          return next
        })
        if (!nextCursor) {
          setSelected(current =>
            current !== null && !page.items.some(photo => photo.id === current)
              ? null
              : current
          )
        }
        setCursor(page.next_cursor)
        setError(null)
      } catch (cause) {
        setError(photoErrorCode(cause, "network_error"))
      } finally {
        galleryBusyRef.current = false
        setGalleryBusy(false)
      }
    },
    [base]
  )

  const fetchNewPhotos = useCallback(async () => {
    if (galleryBusyRef.current) return
    galleryBusyRef.current = true
    setGalleryBusy(true)
    try {
      const knownIds = new Set(photosRef.current.map(photo => photo.id))
      const incoming: Photo[] = []
      let nextCursor = ""
      let foundKnownPhoto = false
      do {
        const query = nextCursor
          ? `?cursor=${encodeURIComponent(nextCursor)}&limit=48`
          : "?limit=48"
        const response = await fetch(`${base}/gallery${query}`, {
          cache: "no-store"
        })
        if (!response.ok) throw photoAPIError(response)
        const page = (await response.json()) as Gallery
        if (knownIds.size === 0) {
          photosRef.current = page.items
          setPhotos(page.items)
          setCursor(page.next_cursor)
          setError(null)
          return
        }
        for (const photo of page.items) {
          if (knownIds.has(photo.id)) {
            foundKnownPhoto = true
            break
          }
          incoming.push(photo)
        }
        nextCursor = page.next_cursor
      } while (!foundKnownPhoto && nextCursor && incoming.length < 3000)

      if (incoming.length > 0) {
        const existingIds = new Set(photosRef.current.map(photo => photo.id))
        const newPhotos = incoming.filter(photo => !existingIds.has(photo.id))
        photosRef.current = [...newPhotos, ...photosRef.current]
        setPhotos(photosRef.current)
        if (playing && newPhotos.length > 0) setSelected(newPhotos[0].id)
      }
      setError(null)
    } catch (cause) {
      setError(photoErrorCode(cause, "network_error"))
    } finally {
      galleryBusyRef.current = false
      setGalleryBusy(false)
    }
  }, [base, playing])

  useEffect(() => {
    if (!galleryOpen || !active) return
    const poll = () => {
      if (document.visibilityState === "visible") void fetchNewPhotos()
    }
    const timer = window.setInterval(poll, 30_000)
    poll()
    document.addEventListener("visibilitychange", poll)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", poll)
    }
  }, [fetchNewPhotos, galleryOpen, active])

  const renewLinks = useCallback(
    async (ids: number[], signal: AbortSignal) => {
      const response = await fetch(`${base}/gallery/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
        cache: "no-store",
        signal
      })
      if (!response.ok) throw photoAPIError(response)
      return (await response.json()) as RenewedPhotoLinks
    },
    [base]
  )
  usePhotoLinks(
    base,
    photos,
    setPhotos,
    active ? [...visibleIDs, ...(selected === null ? [] : [selected])] : [],
    renewLinks
  )
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  const closeViewer = useCallback(() => {
    const id = selected
    setSelected(null)
    setPlaying(false)
    if (id !== null) gridRef.current?.focusPhoto(id)
  }, [selected])

  const moveSelection = useCallback((direction: number) => {
    setSelected(current => {
      if (current === null || photosRef.current.length === 0) return null
      const index = photosRef.current.findIndex(photo => photo.id === current)
      if (index < 0) return photosRef.current[0]?.id ?? null
      const next =
        (index + direction + photosRef.current.length) %
        photosRef.current.length
      return photosRef.current[next]?.id ?? null
    })
  }, [])

  useEffect(() => {
    if (selected === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer()
      }
      if (event.key === "ArrowRight") moveSelection(1)
      if (event.key === "ArrowLeft") moveSelection(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selected, moveSelection, closeViewer])
  useEffect(() => {
    if (!playing || selected === null || photos.length < 2) return
    const timer = window.setInterval(() => moveSelection(1), 6000)
    return () => window.clearInterval(timer)
  }, [playing, selected, photos.length, moveSelection])

  const selectedIndex =
    selected === null ? -1 : photos.findIndex(photo => photo.id === selected)
  const selectedPhoto = selectedIndex < 0 ? null : photos[selectedIndex]

  return {
    photos,
    cursor,
    galleryBusy,
    error,
    setError,
    gridRef,
    fetchGallery,
    setVisibleIDs,
    setSelected,
    selectedPhoto,
    selectedIndex,
    playing,
    setPlaying,
    moveSelection,
    closeViewer
  }
}
