import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent } from "storybook/test"

import { PhotoExperience } from "./photo-experience"

const meta = {
  title: "Photos/PhotoExperience",
  component: PhotoExperience,
  tags: ["autodocs"],
  args: { token: "storybook-event" },
  beforeEach: () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = fn(async input => {
      const data = String(input).includes("/gallery")
        ? { items: [], next_cursor: "" }
        : {
            name: "Banquet test event",
            description: "Guest photos",
            uploads_open: true,
            gallery_open: true,
            remaining: 25
          }
      return new Response(JSON.stringify(data), { status: 200 })
    }) as typeof fetch
    return () => {
      globalThis.fetch = originalFetch
    }
  }
} satisfies Meta<typeof PhotoExperience>

export default meta
type Story = StoryObj<typeof meta>

export const UploadReady: Story = {
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole("heading", { name: "Banquet test event" })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("heading", { name: "Share your photos" })
    ).toBeInTheDocument()
  }
}

export const CameraPhotosReadyForReview: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole("heading", { name: "Banquet test event" })
    await userEvent.click(canvas.getByRole("checkbox"))
    const input = canvas.getByLabelText("Take photo with camera")
    await userEvent.upload(
      input,
      new File([new Uint8Array([0xff, 0xd8, 0xff])], "camera-1.jpg", {
        type: "image/jpeg"
      })
    )
    await userEvent.upload(
      input,
      new File([new Uint8Array([0xff, 0xd8, 0xff])], "camera-2.jpg", {
        type: "image/jpeg"
      })
    )
    await expect(
      canvas.getByAltText("Photo 1 ready to upload")
    ).toBeInTheDocument()
    await expect(
      canvas.getByAltText("Photo 2 ready to upload")
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("button", { name: "Upload photos (2)" })
    ).toBeEnabled()
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove photo 1" })
    )
    await expect(
      canvas.getByRole("button", { name: "Upload photos (1)" })
    ).toBeEnabled()
    await expect(
      canvas.queryByAltText("Photo 2 ready to upload")
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByText("Awaiting approval")
    ).not.toBeInTheDocument()
  }
}

export const BatchUpload: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole("heading", { name: "Banquet test event" })
    await userEvent.click(canvas.getByRole("checkbox"))
    const input = canvas.getByLabelText("Take photo with camera")
    for (const number of [1, 2]) {
      await userEvent.upload(
        input,
        new File([new Uint8Array([0xff, 0xd8, 0xff])], `camera-${number}.jpg`, {
          type: "image/jpeg"
        })
      )
    }

    const originalXHR = globalThis.XMLHttpRequest
    globalThis.XMLHttpRequest = class {
      upload = { onprogress: null }
      status = 201
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      responseText = ""
      open() {}
      send() {
        window.setTimeout(() => this.onload?.(), 0)
      }
    } as unknown as typeof XMLHttpRequest
    try {
      await userEvent.click(
        canvas.getByRole("button", { name: "Upload photos (2)" })
      )
      await expect(
        await canvas.findAllByText("Awaiting approval")
      ).toHaveLength(2)
      await expect(
        canvas.queryByRole("button", { name: /Upload photos \(/ })
      ).not.toBeInTheDocument()
    } finally {
      globalThis.XMLHttpRequest = originalXHR
    }
  }
}

export const EmptyGallery: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole("heading", { name: "Banquet test event" })
    await userEvent.click(canvas.getByRole("button", { name: "Gallery" }))
    await expect(canvas.getByText(/no photos/i)).toBeInTheDocument()
  }
}
