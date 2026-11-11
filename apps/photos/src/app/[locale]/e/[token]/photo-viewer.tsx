"use client"
import { PhotoText } from "@photos/i18n/text"
import { useState } from "react"
import { Download } from "lucide-react"
import { useTranslations } from "next-intl"
import { photoStorageURL } from "@photos/lib/photoClient"
import { localApi } from "./photo-client"
import type { Photo } from "./photo-types"

export function PhotoViewer({
  photo,
  index,
  total,
  playing,
  onTogglePlaying,
  onClose,
  onMove
}: {
  photo: Photo
  index: number
  total: number
  playing: boolean
  onTogglePlaying: () => void
  onClose: () => void
  onMove: (direction: number) => void
}) {
  const photoStatic = useTranslations("PhotosStatic")
  const t = useTranslations("Photos")
  const [downloading, setDownloading] = useState(false)
  const [failedPhotoID, setFailedPhotoID] = useState<number | null>(null)
  const imageURL = photoStorageURL(photo.url, localApi)

  async function downloadPhoto() {
    setDownloading(true)
    setFailedPhotoID(null)
    if (playing) onTogglePlaying()

    try {
      const response = await fetch(imageURL)
      if (!response.ok) throw new Error("Photo download failed")
      const objectURL = URL.createObjectURL(await response.blob())
      const link = document.createElement("a")
      link.href = objectURL
      link.download = `armada-photo-${photo.id}.jpg`
      document.body.append(link)
      link.click()
      link.remove()
      // Give the browser time to begin reading the blob.
      window.setTimeout(() => URL.revokeObjectURL(objectURL), 30_000)
    } catch {
      setFailedPhotoID(photo.id)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photoStatic("photoViewer")}
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
        if (Math.abs(delta) > 60) onMove(delta < 0 ? 1 : -1)
      }}>
      <div className="flex justify-end gap-3 p-4">
        <button type="button" onClick={onTogglePlaying}>
          {playing ? t("pause") : t("slideshow")}
        </button>
        <button type="button" onClick={onClose}>
          <PhotoText id="close" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-between">
        <button
          type="button"
          aria-label={photoStatic("previousPhoto")}
          className="p-4 text-3xl"
          onClick={() => onMove(-1)}>
          ‹
        </button>
        <img
          src={imageURL}
          alt={t("photoNumber", { index: index + 1 })}
          className="max-h-full max-w-[85vw] min-w-0 object-contain"
        />
        <button
          type="button"
          aria-label={photoStatic("nextPhoto")}
          className="p-4 text-3xl"
          onClick={() => onMove(1)}>
          ›
        </button>
      </div>
      <div className="mt-3 text-center">
        <button
          type="button"
          disabled={downloading}
          onClick={() => void downloadPhoto()}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-black disabled:opacity-60">
          <Download aria-hidden="true" size={18} />
          {downloading ? t("downloadingPhoto") : t("downloadPhoto")}
        </button>
        {failedPhotoID === photo.id && (
          <p className="mt-2" role="alert">
            {t("downloadPhotoFailed")}
          </p>
        )}
      </div>
      <p className="p-4 text-center">
        {t("photoPosition", { index: index + 1, total })}
      </p>
    </div>
  )
}
