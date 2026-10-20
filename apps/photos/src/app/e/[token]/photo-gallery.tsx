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
          Load more
        </button>
      )}
    </section>
  )
}
