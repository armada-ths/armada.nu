"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Script from "next/script"

type EventInfo = {
  name: string
  description: string
  uploads_open: boolean
  gallery_open: boolean
  privacy_url: string
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
  error?: string
}

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

const api = process.env.NEXT_PUBLIC_API_URL ?? ""
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""

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
  return new Promise((resolve, reject) => {
    const enterprise = window.grecaptcha?.enterprise
    if (!enterprise || !siteKey) {
      reject(new Error("Verifieringen kunde inte laddas."))
      return
    }
    enterprise.ready(() =>
      enterprise
        .execute(siteKey, { action: "photo_upload" })
        .then(resolve, reject)
    )
  })
}

export function PhotoExperience({ token }: { token: string }) {
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
  const active = useRef(0)
  const uploadsRef = useRef<Upload[]>([])
  const selectionRef = useRef<number | null>(null)
  const photosRef = useRef<Photo[]>([])
  const base = `${api}/api/v1/photo-events/access/${encodeURIComponent(token)}`

  useEffect(
    () => () =>
      uploadsRef.current.forEach(item => URL.revokeObjectURL(item.preview)),
    []
  )

  const updateUploads = useCallback((fn: (items: Upload[]) => Upload[]) => {
    setUploads(previous => {
      const next = fn(previous)
      uploadsRef.current = next
      return next
    })
  }, [])

  const refreshInfo = useCallback(async () => {
    const response = await fetch(
      `${base}?guest_id=${encodeURIComponent(guestID())}`,
      { cache: "no-store" }
    )
    if (!response.ok)
      throw new Error("Eventlänken är ogiltig eller har stängts.")
    setInfo((await response.json()) as EventInfo)
  }, [base])

  const fetchGallery = useCallback(
    async (nextCursor = "") => {
      setGalleryBusy(true)
      try {
        const query = nextCursor
          ? `?cursor=${encodeURIComponent(nextCursor)}&limit=48`
          : "?limit=48"
        const response = await fetch(`${base}/gallery${query}`, {
          cache: "no-store"
        })
        if (!response.ok) throw new Error("Galleriet kunde inte hämtas.")
        const page = (await response.json()) as Gallery
        setPhotos(previous => {
          const next = nextCursor ? [...previous, ...page.items] : page.items
          photosRef.current = next
          return next
        })
        setCursor(page.next_cursor)
        setError("")
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Ett fel uppstod.")
      } finally {
        setGalleryBusy(false)
      }
    },
    [base]
  )

  useEffect(() => {
    let mounted = true
    Promise.all([refreshInfo(), fetchGallery()])
      .catch(cause => {
        if (mounted)
          setError(
            cause instanceof Error
              ? cause.message
              : "Eventet kunde inte laddas."
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
          if (!response.ok) throw new Error("Bildlänkarna kunde inte förnyas.")
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
          "Bildlänkarna kunde inte förnyas. Ladda nya bilder för att försöka igen."
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
        const captcha = await recaptchaToken()
        const form = new FormData()
        form.append("photo", item.file)
        form.append("guest_id", guestID())
        form.append("privacy_confirmed", "true")
        form.append("recaptcha_token", captcha)
        await new Promise<void>((resolve, reject) => {
          const request = new XMLHttpRequest()
          request.open("POST", `${base}/photos`)
          request.upload.onprogress = event => {
            if (event.lengthComputable)
              updateUploads(items =>
                items.map(candidate =>
                  candidate.id === item.id
                    ? {
                        ...candidate,
                        progress: Math.round((100 * event.loaded) / event.total)
                      }
                    : candidate
                )
              )
          }
          request.onload = () =>
            request.status === 201
              ? resolve()
              : reject(
                  new Error(
                    request.responseText || "Uppladdningen misslyckades."
                  )
                )
          request.onerror = () => reject(new Error("Nätverksfel. Försök igen."))
          request.send(form)
        })
        updateUploads(items =>
          items.map(candidate =>
            candidate.id === item.id
              ? { ...candidate, state: "done", progress: 100 }
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
                      : "Uppladdningen misslyckades."
                }
              : candidate
          )
        )
      } finally {
        active.current--
        window.setTimeout(drain, 0)
      }
    },
    [base, refreshInfo, updateUploads]
  )

  const drain = useCallback(() => {
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
  }, [updateUploads, uploadOne])

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const incoming = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      state: "queued" as const
    }))
    updateUploads(items => [...items, ...incoming])
    window.setTimeout(drain, 0)
  }

  useEffect(() => {
    selectionRef.current = selected
  }, [selected])
  useEffect(() => {
    if (selected === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null)
      if (event.key === "ArrowRight")
        setSelected(index =>
          index === null ? null : (index + 1) % photosRef.current.length
        )
      if (event.key === "ArrowLeft")
        setSelected(index =>
          index === null
            ? null
            : (index - 1 + photosRef.current.length) % photosRef.current.length
        )
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selected])
  useEffect(() => {
    if (!playing || selected === null || photos.length < 2) return
    const timer = window.setInterval(
      () =>
        setSelected(index =>
          index === null ? null : (index + 1) % photosRef.current.length
        ),
      6000
    )
    return () => window.clearInterval(timer)
  }, [playing, selected, photos.length])

  if (loading) return <div className="p-8 text-center">Laddar eventet…</div>
  if (!info)
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-3xl font-bold">Armada Photos</h1>
        <p className="mt-4">{error || "Eventet hittades inte."}</p>
      </div>
    )

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-8">
      {siteKey && (
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
        aria-label="Fotoflikar"
        className="mb-8 flex gap-2 rounded-2xl bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 rounded-xl px-4 py-3 font-semibold ${tab === "upload" ? "bg-[#b74465] text-white" : "text-[#172b35]"}`}>
          Ladda upp
        </button>
        <button
          type="button"
          onClick={() => setTab("gallery")}
          className={`flex-1 rounded-xl px-4 py-3 font-semibold ${tab === "gallery" ? "bg-[#b74465] text-white" : "text-[#172b35]"}`}>
          Galleri
        </button>
      </nav>
      {tab === "upload" ? (
        <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Dela dina bilder</h2>
          <p className="mt-2">
            Bilder granskas innan de syns i galleriet. Du kan lägga upp{" "}
            {info.remaining} bilder till från den här enheten.
          </p>
          <p className="mt-2 text-sm">
            JPEG, PNG, WebP, HEIC eller HEIF. Högst 25 MB och 60 megapixel per
            bild.
          </p>
          <label className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={event => setConfirmed(event.target.checked)}
              className="mt-1"
            />
            <span>
              Jag har läst{" "}
              <a
                className="underline"
                href={info.privacy_url}
                target="_blank"
                rel="noreferrer">
                integritetsinformationen
              </a>{" "}
              och har rätt att dela bilderna.
            </span>
          </label>
          <label
            className={`mt-6 block rounded-xl border-2 border-dashed p-8 text-center font-semibold ${confirmed && info.uploads_open && info.remaining > 0 ? "cursor-pointer border-[#b74465]" : "border-gray-300 opacity-60"}`}>
            Välj bilder
            <input
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              multiple
              disabled={!confirmed || !info.uploads_open || info.remaining < 1}
              onChange={event => {
                addFiles(event.target.files)
                event.target.value = ""
              }}
            />
          </label>
          <label
            className={`mt-3 block rounded-xl bg-[#172b35] p-4 text-center font-semibold text-white ${confirmed && info.uploads_open && info.remaining > 0 ? "cursor-pointer" : "opacity-60"}`}>
            Ta foto
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              capture="environment"
              disabled={!confirmed || !info.uploads_open || info.remaining < 1}
              onChange={event => {
                addFiles(event.target.files)
                event.target.value = ""
              }}
            />
          </label>
          {!info.uploads_open && (
            <p className="mt-4">Uppladdningen är stängd.</p>
          )}
          <ul className="mt-6 space-y-3">
            {uploads.map(item => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border p-2">
                <img
                  src={item.preview}
                  alt="Förhandsvisning"
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.file.name}</p>
                  <p className="text-xs">
                    {item.state === "done"
                      ? "Väntar på godkännande"
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
                    Försök igen
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Galleri</h2>
            <button
              type="button"
              onClick={() => void fetchGallery()}
              disabled={galleryBusy}
              className="rounded-xl bg-white px-4 py-2 font-semibold shadow-sm">
              Ladda nya bilder
            </button>
          </div>
          {error && (
            <p role="alert" className="mb-4 text-red-700">
              {error}
            </p>
          )}
          {photos.length === 0 ? (
            <p>Inga bilder är godkända än.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelected(index)}
                  className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={photo.url}
                    alt={`Bild ${index + 1} från ${info.name}`}
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
              Ladda fler
            </button>
          )}
        </section>
      )}
      {selected !== null && photos[selected] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bildvisning"
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
            if (Math.abs(delta) > 60)
              setSelected(index =>
                index === null
                  ? null
                  : (index + (delta < 0 ? 1 : -1) + photos.length) %
                    photos.length
              )
          }}>
          <div className="flex justify-end gap-3 p-4">
            <button type="button" onClick={() => setPlaying(value => !value)}>
              {playing ? "Pausa" : "Bildspel"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected(null)
                setPlaying(false)
              }}>
              Stäng
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-between">
            <button
              type="button"
              aria-label="Föregående bild"
              className="p-4 text-3xl"
              onClick={() =>
                setSelected((selected - 1 + photos.length) % photos.length)
              }>
              ‹
            </button>
            <img
              src={photos[selected].url}
              alt={`Bild ${selected + 1}`}
              className="max-h-full max-w-[85vw] min-w-0 object-contain"
            />
            <button
              type="button"
              aria-label="Nästa bild"
              className="p-4 text-3xl"
              onClick={() => setSelected((selected + 1) % photos.length)}>
              ›
            </button>
          </div>
          <p className="p-4 text-center">
            {selected + 1} / {photos.length}
          </p>
        </div>
      )}
    </main>
  )
}
