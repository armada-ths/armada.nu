"use client"
import { useTranslations } from "next-intl"
import { PhotoText } from "@photos/i18n/text"
import { PhotoGrid } from "./photo-grid"
import { localApi } from "./photo-client"
import type { usePhotoGallery } from "./use-photo-gallery"

export function PhotoGallery({
  gallery,
  eventName
}: {
  gallery: ReturnType<typeof usePhotoGallery>
  eventName: string
}) {
  const errors = useTranslations("PhotoErrors")
  const {
    photos,
    cursor,
    galleryBusy,
    error,
    gridRef,
    fetchGallery,
    setSelected,
    setVisibleIDs
  } = gallery
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          <PhotoText id="gallery" />
        </h2>
        <button
          type="button"
          onClick={() => void fetchGallery()}
          disabled={galleryBusy}
          className="rounded-xl bg-white px-4 py-2 font-semibold shadow-sm">
          <PhotoText id="refreshGallery" />
        </button>
      </div>
      {error && (
        <p role="alert" className="mb-4 text-red-700">
          {errors(error)}
        </p>
      )}
      {photos.length === 0 ? (
        <p>
          <PhotoText id="noPhotosHaveBeenApprovedYet" />
        </p>
      ) : (
        <PhotoGrid
          ref={gridRef}
          photos={photos}
          eventName={eventName}
          localApi={localApi}
          onSelect={setSelected}
          onRangeChange={setVisibleIDs}
        />
      )}
      {cursor && (
        <button
          type="button"
          disabled={galleryBusy}
          onClick={() => void fetchGallery(cursor)}
          className="mx-auto mt-8 block rounded-xl bg-[#b74465] px-6 py-3 font-semibold text-white">
          <PhotoText id="loadMore" />
        </button>
      )}
    </section>
  )
}
