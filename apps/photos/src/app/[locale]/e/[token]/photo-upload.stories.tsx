import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, mocked, spyOn, userEvent, waitFor } from "storybook/test"
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
    const streams: MediaStream[] = []
    const draw = window.setInterval(() => context.fillRect(0, 0, 320, 240), 100)
    const getUserMedia = spyOn(
      navigator.mediaDevices,
      "getUserMedia"
    ).mockImplementation(async () => {
      const stream = source.captureStream(10)
      streams.push(stream)
      return stream
    })
    return () => {
      window.clearInterval(draw)
      streams.forEach(stream =>
        stream.getTracks().forEach(track => track.stop())
      )
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
    const capture = canvas.getByRole("button", { name: "Ta foto" })
    const getTrack = async () => {
      await waitFor(() => expect(capture).toBeEnabled())
      return (preview.srcObject as MediaStream).getVideoTracks()[0]
    }
    const getUserMedia = mocked(navigator.mediaDevices.getUserMedia)
    const firstRearTrack = await getTrack()
    await expect(getUserMedia).toHaveBeenLastCalledWith({
      audio: false,
      video: expect.objectContaining({ facingMode: { ideal: "environment" } })
    })
    await userEvent.click(
      canvas.getByRole("button", { name: "Byt till främre kameran" })
    )
    const frontTrack = await getTrack()
    await expect(firstRearTrack.readyState).toBe("ended")
    await expect(getUserMedia).toHaveBeenLastCalledWith({
      audio: false,
      video: expect.objectContaining({ facingMode: { exact: "user" } })
    })
    await userEvent.click(
      canvas.getByRole("button", { name: "Byt till bakre kameran" })
    )
    const rearTrack = await getTrack()
    await expect(frontTrack.readyState).toBe("ended")
    await expect(getUserMedia).toHaveBeenLastCalledWith({
      audio: false,
      video: expect.objectContaining({ facingMode: { exact: "environment" } })
    })
    await userEvent.click(capture)
    await waitFor(() => expect(rearTrack.readyState).toBe("ended"))
    await expect(
      canvas.getByRole("button", { name: "Ta ett till foto" })
    ).toBeEnabled()
    await expect(canvas.getAllByRole("img")).toHaveLength(1)
  }
}
