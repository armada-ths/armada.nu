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
  return (
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
        if (Math.abs(delta) > 60) onMove(delta < 0 ? 1 : -1)
      }}>
      <div className="flex justify-end gap-3 p-4">
        <button type="button" onClick={onTogglePlaying}>
          {playing ? "Pause" : "Slideshow"}
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-between">
        <button
          type="button"
          aria-label="Previous photo"
          className="p-4 text-3xl"
          onClick={() => onMove(-1)}>
          ‹
        </button>
        <img
          src={photoStorageURL(photo.url, localApi)}
          alt={`Photo ${index + 1}`}
          className="max-h-full max-w-[85vw] min-w-0 object-contain"
        />
        <button
          type="button"
          aria-label="Next photo"
          className="p-4 text-3xl"
          onClick={() => onMove(1)}>
          ›
        </button>
      </div>
      <p className="p-4 text-center">
        {index + 1} / {total}
      </p>
    </div>
  )
}
