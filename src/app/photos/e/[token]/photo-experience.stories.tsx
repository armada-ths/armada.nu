import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent } from "storybook/test"
import { HEX_COLORS } from "@/lib/colors"

import { PhotoExperience } from "./photo-experience"

async function cameraPhoto(number: number): Promise<File> {
  const preview = document.createElement("canvas")
  preview.width = 320
  preview.height = 240
  const context = preview.getContext("2d")
  if (!context) throw new Error("Canvas is unavailable")
  context.fillStyle = number === 1 ? HEX_COLORS.grapefruit : HEX_COLORS.licorice
  context.fillRect(0, 0, preview.width, preview.height)
  context.fillStyle = HEX_COLORS.snow
  context.font = "bold 72px sans-serif"
  context.fillText(String(number), 140, 145)
  const image = await new Promise<Blob>((resolve, reject) => {
    preview.toBlob(
      blob =>
        blob ? resolve(blob) : reject(new Error("Could not make photo")),
      "image/jpeg"
    )
  })
  return new File([image], `camera-${number}.jpg`, { type: "image/jpeg" })
}

async function stageTwoPhotos(input: HTMLElement) {
  await userEvent.upload(input, await cameraPhoto(1))
  await userEvent.upload(input, await cameraPhoto(2))
}

const meta = {
  title: "Photos/PhotoExperience",
  component: PhotoExperience,
  tags: ["autodocs"],
  args: {
    token: "storybook-event",
    getVerificationToken: fn(async () => "storybook-verification-token")
  },
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
    await expect(
      canvas.getByRole("button", { name: "Open camera" })
    ).toBeDisabled()
  }
}

export const PhotosStaged: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole("heading", { name: "Banquet test event" })
    await userEvent.click(canvas.getByRole("checkbox"))
    await stageTwoPhotos(canvas.getByLabelText("Take photo with camera"))
    await expect(
      canvas.getByAltText("Photo 1 ready to upload")
    ).toBeInTheDocument()
    await expect(
      canvas.getByAltText("Photo 2 ready to upload")
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("button", { name: "Upload photos (2)" })
    ).toBeEnabled()
    await expect(
      canvas.getByRole("button", { name: "Take another photo" })
    ).toBeEnabled()
    await expect(
      canvas.queryByText("Awaiting approval")
    ).not.toBeInTheDocument()
  }
}

export const PhotoRemoved: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole("heading", { name: "Banquet test event" })
    await userEvent.click(canvas.getByRole("checkbox"))
    await stageTwoPhotos(canvas.getByLabelText("Take photo with camera"))
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove photo 1" })
    )
    await expect(
      canvas.getByRole("button", { name: "Upload photos (1)" })
    ).toBeEnabled()
    await expect(
      canvas.queryByAltText("Photo 2 ready to upload")
    ).not.toBeInTheDocument()
    await expect(canvas.queryByText("Retake photo")).not.toBeInTheDocument()
  }
}

export const BatchUpload: Story = {
  play: async ({ canvas, args }) => {
    await canvas.findByRole("heading", { name: "Banquet test event" })
    await userEvent.click(canvas.getByRole("checkbox"))
    await stageTwoPhotos(canvas.getByLabelText("Take photo with camera"))

    const originalXHR = globalThis.XMLHttpRequest
    const uploadedNames: string[] = []
    globalThis.XMLHttpRequest = class {
      upload = { onprogress: null }
      status = 201
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      responseText = ""
      open() {}
      send(body: FormData) {
        const photo = body.get("photo")
        if (photo instanceof File) uploadedNames.push(photo.name)
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
      await expect(args.getVerificationToken).toHaveBeenCalledTimes(2)
      await expect(uploadedNames.sort()).toEqual([
        "camera-1.jpg",
        "camera-2.jpg"
      ])
      await expect(
        canvas.queryByRole("button", { name: /Upload photos \(/ })
      ).not.toBeInTheDocument()
    } finally {
      globalThis.XMLHttpRequest = originalXHR
    }
  }
}

export const AutomaticallyApproved: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole("heading", { name: "Banquet test event" })
    await userEvent.click(canvas.getByRole("checkbox"))
    await userEvent.upload(
      canvas.getByLabelText("Take photo with camera"),
      await cameraPhoto(1)
    )
    const originalXHR = globalThis.XMLHttpRequest
    globalThis.XMLHttpRequest = class {
      upload = { onprogress: null }
      status = 201
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      responseText = '{"status":"approved"}'
      open() {}
      send() {
        window.setTimeout(() => this.onload?.(), 0)
      }
    } as unknown as typeof XMLHttpRequest
    try {
      await userEvent.click(
        canvas.getByRole("button", { name: "Upload photos (1)" })
      )
      await expect(
        await canvas.findByText("Added to gallery")
      ).toBeInTheDocument()
      await expect(
        canvas.queryByText("Awaiting approval")
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
