import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent } from "storybook/test"
import { PhotoViewer } from "./photo-viewer"
const meta = {
  title: "Photos/PhotoViewer",
  component: PhotoViewer,
  tags: ["autodocs"],
  args: {
    photo: {
      id: 1,
      url: "/icons/armada-icon.svg?full",
      thumbnail_url: "/icons/armada-icon.svg?thumbnail",
      width: 64,
      height: 64,
      approved_at: "2026-10-20T12:00:00Z"
    },
    index: 0,
    total: 2,
    playing: false,
    onTogglePlaying: fn(),
    onClose: fn(),
    onMove: fn()
  }
} satisfies Meta<typeof PhotoViewer>
export default meta
type Story = StoryObj<typeof meta>
export const Open: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByAltText("Photo 1")).toHaveAttribute(
      "src",
      "/icons/armada-icon.svg?full"
    )
    await userEvent.click(canvas.getByRole("button", { name: "Next photo" }))
    await expect(args.onMove).toHaveBeenCalledWith(1)
    await userEvent.click(canvas.getByRole("button", { name: "Close" }))
    await expect(args.onClose).toHaveBeenCalled()
  }
}
