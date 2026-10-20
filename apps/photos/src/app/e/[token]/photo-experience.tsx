"use client"

import { useCallback, useEffect, useState } from "react"
import Script from "next/script"
import {
  api,
  guestID,
  recaptchaToken,
  siteKey,
  useMobilePhotoDevice
} from "./photo-client"
import type { EventInfo } from "./photo-types"
import { usePhotoGallery } from "./use-photo-gallery"
import { usePhotoUploads } from "./use-photo-uploads"
import { PhotoUpload } from "./photo-upload"
import { PhotoGallery } from "./photo-gallery"
import { PhotoViewer } from "./photo-viewer"

export function PhotoExperience({
  token,
  getVerificationToken = recaptchaToken
}: {
  token: string
  getVerificationToken?: () => Promise<string>
}) {
  const mobileDevice = useMobilePhotoDevice()
  const [info, setInfo] = useState<EventInfo | null>(null)
  const [tab, setTab] = useState<"upload" | "gallery">("upload")
  const [loading, setLoading] = useState(true)
  const base = `${api}/api/v1/photo-events/access/${encodeURIComponent(token)}`
  const gallery = usePhotoGallery({
    base,
    active: tab === "gallery",
    galleryOpen: info?.gallery_open ?? false
  })
  const { fetchGallery, error, setError } = gallery
  const refreshInfo = useCallback(async () => {
    const response = await fetch(
      `${base}?guest_id=${encodeURIComponent(guestID())}`,
      { cache: "no-store" }
    )
    if (!response.ok)
      throw new Error("This event link is invalid or has expired.")
    setInfo((await response.json()) as EventInfo)
  }, [base])

  const upload = usePhotoUploads({
    base,
    info,
    mobileDevice,
    getVerificationToken,
    refreshInfo
  })
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
  }, [refreshInfo, fetchGallery, setError])

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
      {mobileDevice && siteKey && (
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

      {tab === "upload" ? (
        <PhotoUpload info={info} mobileDevice={mobileDevice} upload={upload} />
      ) : (
        <PhotoGallery gallery={gallery} eventName={info.name} />
      )}
      {gallery.selectedPhoto && (
        <PhotoViewer
          photo={gallery.selectedPhoto}
          index={gallery.selectedIndex}
          total={gallery.photos.length}
          playing={gallery.playing}
          onTogglePlaying={() => gallery.setPlaying(value => !value)}
          onClose={gallery.closeViewer}
          onMove={gallery.moveSelection}
        />
      )}
    </main>
  )
}
