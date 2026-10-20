import { useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, waitFor } from "storybook/test"
import { PhotoGrid, type PhotoGridHandle } from "./photo-grid"
import {
  usePhotoLinks,
  type RenewedPhotoLinks
} from "@photos/lib/usePhotoLinks"

const thumb =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="pink"/></svg>'
  )
const photos = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  url: "/full-photo.jpg",
  thumbnail_url: thumb,
  urls_expires_at: new Date(Date.now() + 3600_000).toISOString()
}))
const meta = {
  title: "Photos/PhotoGrid",
  component: PhotoGrid,
  tags: ["autodocs"],
  args: {
    photos,
    eventName: "Large gallery",
    localApi: false,
    onSelect: fn(),
    onRangeChange: fn()
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: 960 }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof PhotoGrid>
export default meta
type Story = StoryObj<typeof meta>

export const LargeGallery: Story = {
  play: async ({ canvasElement, args }) => {
    const cards = () =>
      canvasElement.querySelectorAll<HTMLButtonElement>("[data-photo-id]")
    await waitFor(() => expect(cards().length).toBeGreaterThan(0))
    expect(cards().length).toBeLessThan(40)
    expect(canvasElement.querySelector('img[src="/full-photo.jpg"]')).toBeNull()
    await userEvent.click(cards()[0])
    expect(args.onSelect).toHaveBeenCalledWith(1)
    window.scrollTo(0, 10000)
    await waitFor(() =>
      expect(Number(cards()[0]?.dataset.photoId)).toBeGreaterThan(40)
    )
    expect(cards().length).toBeLessThan(40)
    cards()[cards().length - 1].focus()
    const focused = Number(
      document.activeElement?.getAttribute("data-photo-id")
    )
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() =>
      expect(document.activeElement?.getAttribute("data-photo-id")).toBe(
        String(focused + 1)
      )
    )
    window.scrollTo(0, 0)
  }
}
function UpdatingGrid() {
  const [items, setItems] = useState(photos)
  const handle = useRef<PhotoGridHandle>(null)
  return (
    <>
      <button
        onClick={() =>
          setItems(current => [
            ...Array.from({ length: 8 }, (_, index) => ({
              ...photos[0],
              id: 2000 + index
            })),
            ...current
          ])
        }>
        Prepend photos
      </button>
      <button onClick={() => handle.current?.focusPhoto(900)}>
        Focus photo 900
      </button>
      <PhotoGrid
        ref={handle}
        photos={items}
        eventName="Updates"
        localApi={false}
        onSelect={() => {}}
        onRangeChange={() => {}}
      />
    </>
  )
}
export const LiveUpdates: Story = {
  render: () => <UpdatingGrid />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Focus photo 900" })
    )
    await waitFor(() =>
      expect(document.activeElement?.getAttribute("data-photo-id")).toBe("900")
    )
    const before = canvasElement
      .querySelector('[data-photo-id="900"]')!
      .getBoundingClientRect().top
    // Programmatic click preserves the scrolled viewport while inserting.
    canvas.getByRole("button", { name: "Prepend photos" }).click()
    await waitFor(() =>
      expect(
        Math.abs(
          canvasElement
            .querySelector('[data-photo-id="900"]')!
            .getBoundingClientRect().top - before
        )
      ).toBeLessThan(2)
    )
    window.scrollTo(0, 0)
  }
}
function RenewingGrid() {
  const [items, setItems] = useState(
    photos
      .slice(0, 5)
      .map(photo => ({ ...photo, urls_expires_at: "2000-01-01T00:00:00Z" }))
  )
  const [calls, setCalls] = useState<number[]>([])
  const renew = useRef(async (ids: number[]): Promise<RenewedPhotoLinks> => {
    setCalls(ids)
    return {
      thumbnail_urls: Object.fromEntries(ids.map(id => [id, thumb])),
      urls_expires_at: new Date(Date.now() + 3600_000).toISOString()
    }
  }).current
  usePhotoLinks("story", items, setItems, [1, 2], renew)
  return <div>Renewed IDs: {calls.join(",")}</div>
}
export const RenewVisibleLinksOnly: Story = {
  render: () => <RenewingGrid />,
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByText("Renewed IDs: 1,2")).toBeVisible()
    )
  }
}
export const BrokenThumbnail: Story = {
  args: {
    photos: [
      {
        id: 1,
        url: "/full-photo.jpg",
        thumbnail_url: "data:image/jpeg;base64,AA"
      }
    ]
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByText("Image unavailable")).toBeVisible()
    )
  }
}
