"use client"
import { useLocale, useTranslations } from "next-intl"
import { normalizeLocale, localizedText } from "@armada/shared/i18n/routing"
import { photoAPIError, photoErrorCode } from "@photos/lib/photoErrors"
import { PhotoText } from "@photos/i18n/text"

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
  const photoStatic = useTranslations("PhotosStatic")

  const locale = normalizeLocale(useLocale())
  const errors = useTranslations("PhotoErrors")
  const mobileDevice = useMobilePhotoDevice()
  const [info, setInfo] = useState<EventInfo | null>(null)
  useEffect(() => {
    if (info)
      document.title =
        localizedText(locale, info.name, info.nameSv) + " | Armada Photos"
  }, [locale, info])
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
    if (!response.ok) throw photoAPIError(response)
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
        if (mounted) setError(photoErrorCode(cause, "network_error"))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [refreshInfo, fetchGallery, setError])

  if (loading)
    return (
      <div className="p-8 text-center">
        <PhotoText id="loadingEvent" />
      </div>
    )
  if (!info)
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-3xl font-bold">
          <PhotoText id="armadaPhotos" />
        </h1>
        <p className="mt-4">{errors(error ?? "event_not_found")}</p>
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
          <PhotoText id="tHSArmada" />
        </p>
        <h1 className="mt-2 text-4xl font-bold">
          {localizedText(locale, info.name, info.nameSv)}
        </h1>
        {localizedText(locale, info.description, info.descriptionSv) && (
          <p className="mt-3 text-lg">
            {localizedText(locale, info.description, info.descriptionSv)}
          </p>
        )}
      </header>
      <nav
        aria-label={photoStatic("photoSections")}
        className="mb-8 flex gap-2 rounded-2xl bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 rounded-xl px-4 py-3 font-semibold ${tab === "upload" ? "bg-[#b74465] text-white" : "text-[#172b35]"}`}>
          <PhotoText id="upload" />
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("gallery")
          }}
          className={`flex-1 rounded-xl px-4 py-3 font-semibold ${tab === "gallery" ? "bg-[#b74465] text-white" : "text-[#172b35]"}`}>
          <PhotoText id="gallery" />
        </button>
      </nav>

      {tab === "upload" ? (
        <PhotoUpload info={info} mobileDevice={mobileDevice} upload={upload} />
      ) : (
        <PhotoGallery
          gallery={gallery}
          eventName={localizedText(locale, info.name, info.nameSv)}
        />
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
