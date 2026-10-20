import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useImperativeHandle,
  type Ref
} from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { photoStorageURL } from "@photos/lib/photoClient"
export type GridPhoto = { id: number; url: string; thumbnail_url?: string }
export type PhotoGridHandle = { focusPhoto: (id: number) => void }
function Thumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span role="img" aria-label={alt}>
      Image unavailable
    </span>
  ) : (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  )
}
export function PhotoGrid({
  photos,
  eventName,
  localApi,
  onSelect,
  onRangeChange,
  ref
}: {
  photos: GridPhoto[]
  eventName: string
  localApi: boolean
  onSelect: (id: number) => void
  onRangeChange: (ids: number[]) => void
  ref?: Ref<PhotoGridHandle>
}) {
  const container = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState({ width: 0, columns: 2, top: 0 })
  const previous = useRef(photos)
  const pendingFocus = useRef<number | null>(null)
  const rowHeight = layout.width
    ? (layout.width - (layout.columns - 1) * 8) / layout.columns + 8
    : 240
  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(photos.length / layout.columns),
    estimateSize: () => rowHeight,
    overscan: 2,
    scrollMargin: layout.top,
    useFlushSync: false
  })
  useLayoutEffect(() => {
    const node = container.current
    if (!node) return
    const measure = () => {
      const next = {
        width: node.clientWidth,
        columns: window.matchMedia("(min-width: 768px)").matches
          ? 4
          : window.matchMedia("(min-width: 640px)").matches
            ? 3
            : 2,
        top: node.getBoundingClientRect().top + window.scrollY
      }
      setLayout(old =>
        old.width === next.width &&
        old.top === next.top &&
        old.columns === next.columns
          ? old
          : next
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    if (node.parentElement) observer.observe(node.parentElement)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])
  useLayoutEffect(() => {
    virtualizer.measure()
  }, [rowHeight, virtualizer])
  useLayoutEffect(() => {
    const old = previous.current
    if (
      old.length &&
      photos[0]?.id !== old[0]?.id &&
      window.scrollY > layout.top
    ) {
      const oldRow = Math.max(
        0,
        Math.floor((window.scrollY - layout.top) / rowHeight)
      )
      const anchor = old[oldRow * layout.columns]
      const index = anchor
        ? photos.findIndex(photo => photo.id === anchor.id)
        : -1
      if (index >= 0)
        window.scrollBy(
          0,
          (Math.floor(index / layout.columns) - oldRow) * rowHeight
        )
    }
    previous.current = photos
  }, [photos, layout.columns, layout.top, rowHeight])
  const rows = virtualizer.getVirtualItems()
  const first = rows[0]?.index ?? 0
  const last = rows.at(-1)?.index ?? -1
  useEffect(() => {
    onRangeChange(
      photos
        .slice(first * layout.columns, (last + 1) * layout.columns)
        .map(photo => photo.id)
    )
  }, [first, last, layout.columns, photos, onRangeChange])
  const focusPhoto = (id: number) => {
    const index = photos.findIndex(photo => photo.id === id)
    if (index < 0) return
    pendingFocus.current = id
    virtualizer.scrollToIndex(Math.floor(index / layout.columns), {
      align: "auto"
    })
    const button = container.current?.querySelector<HTMLButtonElement>(
      `[data-photo-id="${id}"]`
    )
    if (button) {
      button.focus({ preventScroll: true })
      pendingFocus.current = null
    }
  }
  useImperativeHandle(ref, () => ({ focusPhoto }))
  useLayoutEffect(() => {
    if (pendingFocus.current === null) return
    const button = container.current?.querySelector<HTMLButtonElement>(
      `[data-photo-id="${pendingFocus.current}"]`
    )
    if (button) {
      button.focus({ preventScroll: true })
      pendingFocus.current = null
    }
  })
  return (
    <div
      ref={container}
      style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
      {rows.map(row => (
        <div
          key={row.key}
          data-gallery-row={row.index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${row.start - layout.top}px)`,
            display: "grid",
            gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
            gap: 8
          }}>
          {photos
            .slice(row.index * layout.columns, (row.index + 1) * layout.columns)
            .map((photo, offset) => {
              const index = row.index * layout.columns + offset
              const src = photoStorageURL(
                photo.thumbnail_url || photo.url,
                localApi
              )
              return (
                <button
                  key={photo.id}
                  data-photo-id={photo.id}
                  type="button"
                  onClick={() => onSelect(photo.id)}
                  onKeyDown={event => {
                    const direction =
                      event.key === "ArrowRight"
                        ? 1
                        : event.key === "ArrowLeft"
                          ? -1
                          : event.key === "ArrowDown"
                            ? layout.columns
                            : event.key === "ArrowUp"
                              ? -layout.columns
                              : event.key === "Tab"
                                ? event.shiftKey
                                  ? -1
                                  : 1
                                : 0
                    const next = index + direction
                    if (direction && next >= 0 && next < photos.length) {
                      event.preventDefault()
                      focusPhoto(photos[next].id)
                    }
                  }}
                  className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                  <Thumbnail
                    key={src}
                    src={src}
                    alt={`Photo ${index + 1} from ${eventName}`}
                  />
                </button>
              )
            })}
        </div>
      ))}
    </div>
  )
}
