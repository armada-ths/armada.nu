import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, spyOn, userEvent, waitFor } from "storybook/test"
import { PhotoUpload } from "./photo-upload"
import { usePhotoUploads } from "./use-photo-uploads"

const info = {
  name: "Upload preview",
  description: "",
  uploads_open: true,
  gallery_open: true,
  remaining: 25
}
const verify = fn(async () => "storybook-verification")
const refreshInfo = fn(async () => {})
function UploadPreview({ mobileDevice = true }: { mobileDevice?: boolean }) {
  const upload = usePhotoUploads({
    base: "/storybook-photos",
    info,
    mobileDevice,
    getVerificationToken: verify,
    refreshInfo
  })
  return <PhotoUpload info={info} mobileDevice={mobileDevice} upload={upload} />
}
const meta = {
  title: "Photos/PhotoUpload",
  component: UploadPreview,
  tags: ["autodocs"],
  args: { mobileDevice: true }
} satisfies Meta<typeof UploadPreview>
export default meta
type Story = StoryObj<typeof meta>
export const CameraReady: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Share your photos" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Open camera" })
    ).toBeDisabled()
  }
}
export const Desktop: Story = {
  args: { mobileDevice: false },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Upload from your phone" })
    ).toBeVisible()
  }
}

export const Swedish: Story = {
  globals: { locale: "sv" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Dela dina foton" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Öppna kameran" })
    ).toBeDisabled()
  }
}

export const AppCameraCapture: Story = {
  globals: { locale: "sv" },
  beforeEach: () => {
    const source = document.createElement("canvas")
    source.width = 320
    source.height = 240
    const context = source.getContext("2d")!
    const stream = source.captureStream(10)
    const track = stream.getVideoTracks()[0]
    const draw = window.setInterval(() => context.fillRect(0, 0, 320, 240), 100)
    const getUserMedia = spyOn(
      navigator.mediaDevices,
      "getUserMedia"
    ).mockResolvedValue(stream)
    return () => {
      window.clearInterval(draw)
      track.stop()
      getUserMedia.mockRestore()
    }
  },
  play: async ({ canvas }) => {
    const fallback = canvas.getByRole("button", { name: "Använd appkameran" })
    await expect(fallback).toBeDisabled()
    await userEvent.click(canvas.getByRole("checkbox"))
    await expect(
      canvas.getByRole("button", { name: "Öppna kameran" })
    ).toBeEnabled()
    await userEvent.click(fallback)
    const preview = canvas.getByLabelText<HTMLVideoElement>(
      "Kamerans förhandsvisning"
    )
    const track = (
      await waitFor(() => {
        const stream = preview.srcObject as MediaStream | null
        if (!stream) throw new Error("Camera preview has no stream")
        return stream
      })
    ).getVideoTracks()[0]
    const capture = canvas.getByRole("button", { name: "Ta foto" })
    await waitFor(() => expect(capture).toBeEnabled())
    await userEvent.click(capture)
    await waitFor(() => expect(track.readyState).toBe("ended"))
    await expect(
      canvas.getByRole("button", { name: "Ta ett till foto" })
    ).toBeEnabled()
    await expect(canvas.getAllByRole("img")).toHaveLength(1)
  }
}
