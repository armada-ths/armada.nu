"use client"
import { LanguageSwitcher } from "@armada/shared/i18n/client"
import { PhotoText } from "@photos/i18n/text"
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
        <LanguageSwitcher refresh={false} />
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
          src={photoStorageURL(photo.url, localApi)}
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
      <p className="p-4 text-center">
        {t("photoPosition", { index: index + 1, total })}
      </p>
    </div>
  )
}
