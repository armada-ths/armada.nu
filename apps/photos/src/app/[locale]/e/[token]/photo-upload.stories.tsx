import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn } from "storybook/test"
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
