import { useEffect } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { PhotoGallery } from "./photo-gallery"
import { usePhotoGallery } from "./use-photo-gallery"

function GalleryPreview() {
  const gallery = usePhotoGallery({
    base: "/storybook-gallery",
    active: true,
    galleryOpen: true
  })
  const { fetchGallery } = gallery
  useEffect(() => {
    void fetchGallery()
  }, [fetchGallery])
  return <PhotoGallery gallery={gallery} eventName="Gallery preview" />
}
const meta = {
  title: "Photos/PhotoGallery",
  component: GalleryPreview,
  tags: ["autodocs"],
  beforeEach: ({ parameters }) => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          items: parameters.empty
            ? []
            : [
                {
                  id: 1,
                  url: "/icons/armada-icon.svg?full",
                  thumbnail_url: "/icons/armada-icon.svg?thumbnail",
                  width: 64,
                  height: 64,
                  approved_at: "2026-10-20T12:00:00Z",
                  urls_expires_at: "2099-01-01T00:00:00Z"
                }
              ],
          next_cursor: ""
        }),
        { status: 200 }
      )
    return () => {
      globalThis.fetch = originalFetch
    }
  }
} satisfies Meta<typeof GalleryPreview>
export default meta
type Story = StoryObj<typeof meta>
export const WithPhotos: Story = {
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByAltText("Photo 1 from Gallery preview")
    ).toHaveAttribute("src", "/icons/armada-icon.svg?thumbnail")
  }
}
export const Empty: Story = {
  parameters: { empty: true },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByText("No photos have been approved yet.")
    ).toBeVisible()
  }
}
