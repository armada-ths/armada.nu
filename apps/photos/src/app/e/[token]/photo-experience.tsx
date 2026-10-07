"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent
} from "react"
import Script from "next/script"
import { X } from "lucide-react"
import { shouldSkipPhotoRecaptcha } from "@photos/lib/photoRecaptcha"
import { isMobilePhotoDevice } from "@photos/lib/photoDevice"
import { env } from "@photos/env"

type EventInfo = {
  name: string
  description: string
  uploads_open: boolean
  gallery_open: boolean
  remaining: number
}
type Photo = {
  id: number
  url: string
  width: number
  height: number
  approved_at: string
}
type Gallery = { items: Photo[]; next_cursor: string }
type Upload = {
  id: string
  file: File
  preview: string
  progress: number
  state: "queued" | "uploading" | "done" | "error"
  approval?: "approved" | "pending"
  error?: string
}
type StagedPhoto = { id: string; file: File; preview: string }

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void
        execute: (
          siteKey: string,
          options: { action: string }
        ) => Promise<string>
      }
    }
  }
}

const api = env.NEXT_PUBLIC_API_URL
const siteKey = env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const skipLocalRecaptcha = shouldSkipPhotoRecaptcha(api, process.env.NODE_ENV)

// Device information is constant for this page; SSR must not access navigator.
const subscribeToDevice = () => () => {}
const getMobileDeviceSnapshot = () => isMobilePhotoDevice(navigator)
const getServerDeviceSnapshot = () => false

function guestID() {
  const key = "armada-photo-guest"
  let value = localStorage.getItem(key)
  if (!value) {
    value = crypto.randomUUID()
    localStorage.setItem(key, value)
  }
  return value
}

function recaptchaToken(): Promise<string> {
  if (skipLocalRecaptcha) return Promise.resolve("")
  return new Promise((resolve, reject) => {
    const enterprise = window.grecaptcha?.enterprise
    if (!enterprise || !siteKey) {
      reject(new Error("Verification could not be loaded."))
      return
    }
    enterprise.ready(() =>
      enterprise
        .execute(siteKey, { action: "photo_upload" })
        .then(resolve, reject)
    )
  })
}

export function PhotoExperience({
  token,
  getVerificationToken = recaptchaToken
}: {
  token: string
  getVerificationToken?: () => Promise<string>
}) {
  const mobileDevice = useSyncExternalStore(
    subscribeToDevice,
    getMobileDeviceSnapshot,
    getServerDeviceSnapshot
  )
  const [info, setInfo] = useState<EventInfo | null>(null)
  const [tab, setTab] = useState<"upload" | "gallery">("upload")
  const [uploads, setUploads] = useState<Upload[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [cursor, setCursor] = useState("")
  const [selected, setSelected] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [galleryBusy, setGalleryBusy] = useState(false)
  const [error, setError] = useState("")
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([])
  const [cameraError, setCameraError] = useState("")
  const active = useRef(0)
  const uploadsRef = useRef<Upload[]>([])
  const photosRef = useRef<Photo[]>([])
  const galleryBusyRef = useRef(false)
  const stagedPhotosRef = useRef<StagedPhoto[]>([])
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const base = `${api}/api/v1/photo-events/access/${encodeURIComponent(token)}`

  useEffect(
    () => () => {
      uploadsRef.current.forEach(item => URL.revokeObjectURL(item.preview))
      stagedPhotosRef.current.forEach(photo =>
        URL.revokeObjectURL(photo.preview)
      )
    },
    []
  )

  const updateUploads = useCallback((fn: (items: Upload[]) => Upload[]) => {
    const next = fn(uploadsRef.current)
    uploadsRef.current = next
    setUploads(next)
  }, [])

  const refreshInfo = useCallback(async () => {
    const response = await fetch(
      `${base}?guest_id=${encodeURIComponent(guestID())}`,
      { cache: "no-store" }
    )
    if (!response.ok)
      throw new Error("This event link is invalid or has expired.")
    setInfo((await response.json()) as EventInfo)
  }, [base])

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
        if (!response.ok) throw new Error("The gallery could not be loaded.")
        const page = (await response.json()) as Gallery
        setPhotos(previous => {
          const next = nextCursor ? [...previous, ...page.items] : page.items
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
        setError("")
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Something went wrong."
        )
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
        if (!response.ok) throw new Error("Live gallery update failed.")
        const page = (await response.json()) as Gallery
        if (knownIds.size === 0) {
          photosRef.current = page.items
          setPhotos(page.items)
          setCursor(page.next_cursor)
          setError("")
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
      setError("")
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Live gallery update failed."
      )
    } finally {
      galleryBusyRef.current = false
      setGalleryBusy(false)
    }
  }, [base, playing])

  useEffect(() => {
    let mounted = true
    Promise.all([refreshInfo(), fetchGallery()])
      .catch(cause => {
        if (mounted)
          setError(
            cause instanceof Error
              ? cause.message
              : "The event could not be loaded."
          )
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [refreshInfo, fetchGallery])

  useEffect(() => {
    if (!info?.gallery_open || tab !== "gallery") return
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
  }, [fetchNewPhotos, info?.gallery_open, tab])

  useEffect(() => {
    const renew = async () => {
      if (!info?.gallery_open || photosRef.current.length === 0) return
      try {
        const urls: Record<string, string> = {}
        for (let start = 0; start < photosRef.current.length; start += 100) {
          const ids = photosRef.current
            .slice(start, start + 100)
            .map(photo => photo.id)
          const response = await fetch(`${base}/gallery/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
            cache: "no-store"
          })
          if (!response.ok) throw new Error("Photo links could not be renewed.")
          Object.assign(
            urls,
            ((await response.json()) as { urls: Record<string, string> }).urls
          )
        }
        setPhotos(previous => {
          const updated = previous.map(photo => ({
            ...photo,
            url: urls[String(photo.id)] ?? photo.url
          }))
          photosRef.current = updated
          return updated
        })
      } catch {
        setError(
          "Photo links could not be renewed. Refresh the gallery to try again."
        )
      }
    }
    const timer = window.setInterval(
      () => {
        void renew()
      },
      50 * 60 * 1000
    )
    const onVisible = () => {
      if (document.visibilityState === "visible") void renew()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [base, info?.gallery_open])

  const uploadOne = useCallback(
    async (item: Upload) => {
      try {
        const captcha = await getVerificationToken()
        const form = new FormData()
        form.append("photo", item.file)
        form.append("guest_id", guestID())
        form.append("privacy_confirmed", "true")
        form.append("recaptcha_token", captcha)
        const approval = await new Promise<"approved" | "pending">(
          (resolve, reject) => {
            const request = new XMLHttpRequest()
            request.open("POST", `${base}/photos`)
            request.upload.onprogress = event => {
              if (event.lengthComputable)
                updateUploads(items =>
                  items.map(candidate =>
                    candidate.id === item.id
                      ? {
                          ...candidate,
                          progress: Math.round(
                            (100 * event.loaded) / event.total
                          )
                        }
                      : candidate
                  )
                )
            }
            request.onload = () => {
              if (request.status !== 201) {
                reject(new Error(request.responseText || "The upload failed."))
                return
              }
              try {
                const result = JSON.parse(request.responseText) as {
                  status?: string
                }
                resolve(result.status === "approved" ? "approved" : "pending")
              } catch {
                resolve("pending")
              }
            }
            request.onerror = () =>
              reject(new Error("Network error. Please try again."))
            request.send(form)
          }
        )
        updateUploads(items =>
          items.map(candidate =>
            candidate.id === item.id
              ? { ...candidate, state: "done", approval, progress: 100 }
              : candidate
          )
        )
        void refreshInfo()
      } catch (cause) {
        updateUploads(items =>
          items.map(candidate =>
            candidate.id === item.id
              ? {
                  ...candidate,
                  state: "error",
                  error:
                    cause instanceof Error
                      ? cause.message
                      : "The upload failed."
                }
              : candidate
          )
        )
      } finally {
        active.current--
        window.setTimeout(drain, 0)
      }
    },
    [base, getVerificationToken, refreshInfo, updateUploads]
  )

  const drain = useCallback(() => {
    if (!mobileDevice) return
    while (active.current < 2) {
      const item = uploadsRef.current.find(
        candidate => candidate.state === "queued"
      )
      if (!item) break
      active.current++
      updateUploads(items =>
        items.map(candidate =>
          candidate.id === item.id
            ? { ...candidate, state: "uploading" }
            : candidate
        )
      )
      void uploadOne(item)
    }
  }, [mobileDevice, updateUploads, uploadOne])

  const onCameraPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""
    if (!file || !mobileDevice) return
    if (
      (file.type && !file.type.startsWith("image/")) ||
      file.size > 25 * 1024 * 1024
    ) {
      setCameraError("Choose a camera photo smaller than 25 MB.")
      return
    }
    if (stagedPhotosRef.current.length >= (info?.remaining ?? 0)) {
      setCameraError("You have reached the photo limit for this event.")
      return
    }
    const next = {
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file)
    }
    stagedPhotosRef.current = [...stagedPhotosRef.current, next]
    setStagedPhotos(stagedPhotosRef.current)
    setCameraError("")
  }

  const removeStagedPhoto = (id: string) => {
    const photo = stagedPhotosRef.current.find(candidate => candidate.id === id)
    if (!photo) return
    URL.revokeObjectURL(photo.preview)
    stagedPhotosRef.current = stagedPhotosRef.current.filter(
      candidate => candidate.id !== id
    )
    setStagedPhotos(stagedPhotosRef.current)
    setCameraError("")
  }

  const uploadStagedPhotos = () => {
    const staged = stagedPhotosRef.current
    if (
      staged.length === 0 ||
      !mobileDevice ||
      !confirmed ||
      !info?.uploads_open ||
      staged.length > info.remaining
    )
      return
    stagedPhotosRef.current = []
    setStagedPhotos([])
    updateUploads(items => [
      ...items,
      ...staged.map(photo => ({
        id: photo.id,
        file: photo.file,
        preview: photo.preview,
        progress: 0,
        state: "queued" as const
      }))
    ])
    window.setTimeout(drain, 0)
  }

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
        setSelected(null)
        setPlaying(false)
      }
      if (event.key === "ArrowRight") moveSelection(1)
      if (event.key === "ArrowLeft") moveSelection(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selected, moveSelection])
  useEffect(() => {
    if (!playing || selected === null || photos.length < 2) return
    const timer = window.setInterval(() => moveSelection(1), 6000)
    return () => window.clearInterval(timer)
  }, [playing, selected, photos.length, moveSelection])

  const selectedIndex =
    selected === null ? -1 : photos.findIndex(photo => photo.id === selected)
  const selectedPhoto = selectedIndex < 0 ? null : photos[selectedIndex]

  if (loading) return <div className="p-8 text-center">Loading event…</div>
  if (!info)
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-3xl font-bold">Armada Photos</h1>
        <p className="mt-4">{error || "Event not found."}</p>
      </div>
    )

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-8">
      {mobileDevice && siteKey && !skipLocalRecaptcha && (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      )}
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold tracking-[.2em] text-[#b74465] uppercase">
          THS Armada
        </p>
        <h1 className="mt-2 text-4xl font-bold">{info.name}</h1>
        {info.description && <p className="mt-3 text-lg">{info.description}</p>}
      </header>
      <nav
        aria-label="Photo sections"
        className="mb-8 flex gap-2 rounded-2xl bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 rounded-xl px-4 py-3 font-semibold ${tab === "upload" ? "bg-[#b74465] text-white" : "text-[#172b35]"}`}>
          Upload
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("gallery")
          }}
          className={`flex-1 rounded-xl px-4 py-3 font-semibold ${tab === "gallery" ? "bg-[#b74465] text-white" : "text-[#172b35]"}`}>
          Gallery
        </button>
      </nav>
      {tab === "upload" && !mobileDevice ? (
        <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Upload from your phone</h2>
          <p className="mt-2">
            Photo uploads are only available on mobile devices. Open this event
            link on your phone or tablet to take and upload photos.
          </p>
          <p className="mt-2">You can still view the gallery on this device.</p>
        </section>
      ) : tab === "upload" ? (
        <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Share your photos</h2>
          <p className="mt-2">
            Photos are checked before they appear in the gallery. You can upload{" "}
            {info.remaining} more photos from this device.
          </p>
          <p className="mt-2 text-sm">
            Take photos with your camera, review them here, then upload them
            together. Your phone may ask you to confirm each photo first.
          </p>
          <label className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={event => {
                setConfirmed(event.target.checked)
              }}
              className="mt-1"
            />
            <span>
              I have read the{" "}
              <a
                className="underline"
                href="/privacy"
                target="_blank"
                rel="noreferrer">
                privacy information
              </a>{" "}
              and have the right to share these photos.
            </span>
          </label>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            aria-label="Take photo with camera"
            className="sr-only"
            onChange={onCameraPhoto}
          />
          <button
            type="button"
            className="mt-6 block w-full rounded-xl bg-[#172b35] p-4 text-center font-semibold text-white disabled:opacity-60"
            disabled={
              !confirmed ||
              !info.uploads_open ||
              stagedPhotos.length >= info.remaining
            }
            onClick={() => cameraInputRef.current?.click()}>
            {stagedPhotos.length > 0 ? "Take another photo" : "Open camera"}
          </button>
          {stagedPhotos.length > 0 && (
            <div className="mt-4">
              <p className="mb-3 font-semibold">
                {stagedPhotos.length}{" "}
                {stagedPhotos.length === 1 ? "photo" : "photos"} ready to upload
              </p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {stagedPhotos.map((photo, index) => (
                  <li key={photo.id} className="relative">
                    <img
                      src={photo.preview}
                      alt={`Photo ${index + 1} ready to upload`}
                      className="aspect-square w-full rounded-xl bg-black object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute top-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-white text-[#172b35] shadow-sm"
                      onClick={() => removeStagedPhoto(photo.id)}>
                      <X aria-hidden="true" size={18} />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-[#b74465] p-4 font-semibold text-white disabled:opacity-60"
                disabled={
                  !confirmed ||
                  !info.uploads_open ||
                  stagedPhotos.length > info.remaining
                }
                onClick={uploadStagedPhotos}>
                Upload photos ({stagedPhotos.length})
              </button>
            </div>
          )}
          {cameraError && (
            <p role="alert" className="mt-3 text-red-700">
              {cameraError}
            </p>
          )}
          {!info.uploads_open && <p className="mt-4">Uploads are closed.</p>}
          <ul className="mt-6 space-y-3">
            {uploads.map(item => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border p-2">
                <img
                  src={item.preview}
                  alt="Photo preview"
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">Photo taken with camera</p>
                  <p className="text-xs">
                    {item.state === "done"
                      ? item.approval === "approved"
                        ? "Added to gallery"
                        : "Awaiting approval"
                      : item.state === "error"
                        ? item.error
                        : `${item.progress} %`}
                  </p>
                  {item.state === "uploading" && (
                    <progress
                      className="w-full"
                      value={item.progress}
                      max="100"
                    />
                  )}
                </div>
                {item.state === "error" && (
                  <button
                    type="button"
                    className="rounded bg-[#b74465] px-3 py-2 text-sm text-white"
                    onClick={() => {
                      updateUploads(items =>
                        items.map(candidate =>
                          candidate.id === item.id
                            ? {
                                ...candidate,
                                state: "queued",
                                error: undefined,
                                progress: 0
                              }
                            : candidate
                        )
                      )
                      window.setTimeout(drain, 0)
                    }}>
                    Try again
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gallery</h2>
            <button
              type="button"
              onClick={() => void fetchGallery()}
              disabled={galleryBusy}
              className="rounded-xl bg-white px-4 py-2 font-semibold shadow-sm">
              Refresh gallery
            </button>
          </div>
          {error && (
            <p role="alert" className="mb-4 text-red-700">
              {error}
            </p>
          )}
          {photos.length === 0 ? (
            <p>No photos have been approved yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelected(photo.id)}
                  className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1} from ${info.name}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          {cursor && (
            <button
              type="button"
              disabled={galleryBusy}
              onClick={() => void fetchGallery(cursor)}
              className="mx-auto mt-8 block rounded-xl bg-[#b74465] px-6 py-3 font-semibold text-white">
              Load more
            </button>
          )}
        </section>
      )}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
          onTouchStart={event => {
            ;(event.currentTarget as HTMLElement).dataset.startX = String(
              event.touches[0]?.clientX ?? 0
            )
          }}
          onTouchEnd={event => {
            const delta =
              event.changedTouches[0]?.clientX -
              Number((event.currentTarget as HTMLElement).dataset.startX)
            if (Math.abs(delta) > 60) moveSelection(delta < 0 ? 1 : -1)
          }}>
          <div className="flex justify-end gap-3 p-4">
            <button type="button" onClick={() => setPlaying(value => !value)}>
              {playing ? "Pause" : "Slideshow"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected(null)
                setPlaying(false)
              }}>
              Close
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-between">
            <button
              type="button"
              aria-label="Previous photo"
              className="p-4 text-3xl"
              onClick={() => moveSelection(-1)}>
              ‹
            </button>
            <img
              src={selectedPhoto.url}
              alt={`Photo ${selectedIndex + 1}`}
              className="max-h-full max-w-[85vw] min-w-0 object-contain"
            />
            <button
              type="button"
              aria-label="Next photo"
              className="p-4 text-3xl"
              onClick={() => moveSelection(1)}>
              ›
            </button>
          </div>
          <p className="p-4 text-center">
            {selectedIndex + 1} / {photos.length}
          </p>
        </div>
      )}
    </main>
  )
}
