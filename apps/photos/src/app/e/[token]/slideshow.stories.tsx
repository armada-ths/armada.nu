import { HEX_COLORS } from "@armada/shared/colors"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, waitFor } from "storybook/test"

import { Slideshow, type SlidePhoto } from "./slideshow"

const palette = [
  HEX_COLORS.grapefruit,
  HEX_COLORS.licorice,
  HEX_COLORS.melon,
  HEX_COLORS.pineapple,
  HEX_COLORS.silver
]
const sizes = [
  [1280, 720],
  [720, 1080],
  [1000, 1000],
  [1920, 800],
  [800, 1280]
] as const

function makePhotos(count: number): SlidePhoto[] {
  return Array.from({ length: count }, (_, index) => {
    const [width, height] = sizes[index % sizes.length]
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Canvas is unavailable")
    context.fillStyle = palette[index % palette.length]
    context.fillRect(0, 0, width, height)
    context.fillStyle = HEX_COLORS.snow
    context.font = `bold ${Math.round(height / 3)}px sans-serif`
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText(String(index + 1), width / 2, height / 2)
    return {
      id: index + 1,
      url: canvas.toDataURL("image/jpeg", 0.8),
      width,
      height
    }
  })
}

const photos = makePhotos(5)

const meta = {
  title: "Photos/Slideshow",
  component: Slideshow,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    photos,
    startId: 1,
    intervalMs: 600,
    transitionMs: 200,
    onClose: fn()
  }
} satisfies Meta<typeof Slideshow>

export default meta
type Story = StoryObj<typeof meta>

async function expectPosition(
  canvas: { findByTestId: (id: string) => Promise<HTMLElement> },
  text: string
) {
  const counter = await canvas.findByTestId("slideshow-counter")
  await waitFor(() => expect(counter).toHaveTextContent(text), {
    timeout: 4000
  })
}

export const Default: Story = {
  args: { intervalMs: 9000, transitionMs: 1300 },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole("dialog", { name: "Photo slideshow" })
    ).toBeInTheDocument()
    await expectPosition(canvas, "1 / 5")
  }
}

export const AutoAdvance: Story = {
  args: { intervalMs: 1500 },
  play: async ({ canvas }) => {
    await expectPosition(canvas, "1 / 5")
    await expectPosition(canvas, "2 / 5")
  }
}

export const ManualNavigation: Story = {
  args: { intervalMs: 60000 },
  play: async ({ canvas }) => {
    await expectPosition(canvas, "1 / 5")
    await userEvent.click(canvas.getByRole("button", { name: "Next photo" }))
    await expectPosition(canvas, "2 / 5")
    await userEvent.click(
      canvas.getByRole("button", { name: "Previous photo" })
    )
    await expectPosition(canvas, "1 / 5")
    await userEvent.click(
      canvas.getByRole("button", { name: "Previous photo" })
    )
    await expectPosition(canvas, "5 / 5")
  }
}

export const RapidNavigation: Story = {
  args: { intervalMs: 60000 },
  play: async ({ canvas }) => {
    await expectPosition(canvas, "1 / 5")
    const next = canvas.getByRole("button", { name: "Next photo" })
    for (let click = 0; click < 4; click++) await userEvent.click(next)
    // Quick repeats accumulate into one smooth move instead of queueing.
    await expectPosition(canvas, "5 / 5")
    await new Promise(resolve => setTimeout(resolve, 800))
    await expect(canvas.getByTestId("slideshow-counter")).toHaveTextContent(
      "5 / 5"
    )
  }
}

export const PauseAndResume: Story = {
  args: { intervalMs: 3000 },
  play: async ({ canvas }) => {
    await expectPosition(canvas, "1 / 5")
    await userEvent.click(canvas.getByRole("button", { name: "Pause" }))
    await expect(
      canvas.getByRole("button", { name: "Play" })
    ).toBeInTheDocument()
    await new Promise(resolve => setTimeout(resolve, 1500))
    await expect(canvas.getByTestId("slideshow-counter")).toHaveTextContent(
      "1 / 5"
    )
    await userEvent.click(canvas.getByRole("button", { name: "Play" }))
    await expectPosition(canvas, "2 / 5")
  }
}

export const KeyboardControls: Story = {
  args: { intervalMs: 60000 },
  play: async ({ canvas, args }) => {
    await expectPosition(canvas, "1 / 5")
    await userEvent.keyboard("{ArrowRight}")
    await expectPosition(canvas, "2 / 5")
    await userEvent.keyboard("{ArrowLeft}")
    await expectPosition(canvas, "1 / 5")
    await userEvent.keyboard(" ")
    await expect(
      canvas.getByRole("button", { name: "Play" })
    ).toBeInTheDocument()
    await userEvent.keyboard(" ")
    await expect(
      canvas.getByRole("button", { name: "Pause" })
    ).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await expect(args.onClose).toHaveBeenCalled()
  }
}

export const CloseButton: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(
      await canvas.findByRole("button", { name: "Close slideshow" })
    )
    await expect(args.onClose).toHaveBeenCalled()
  }
}

export const StartsAtSelectedPhoto: Story = {
  args: { startId: 3, intervalMs: 60000 },
  play: async ({ canvas }) => {
    await expectPosition(canvas, "3 / 5")
  }
}

export const NeighboursVisible: Story = {
  args: { intervalMs: 60000 },
  play: async ({ canvas, canvasElement }) => {
    await expectPosition(canvas, "1 / 5")
    const slides = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(".slideshow-slide")
    )
    await expect(slides.length).toBeGreaterThanOrEqual(5)
    // The strip is always drifting, so match the slide nearest the right-hand slot.
    const shift = (slide: HTMLElement) =>
      Number(/translate3d\((-?[\d.]+)%/.exec(slide.style.transform)?.[1])
    const next = slides.find(slide => Math.abs(shift(slide) - 32) < 1)
    if (!next)
      throw new Error("The next photo is not rendered beside the current one")
    await userEvent.click(next)
    await expectPosition(canvas, "2 / 5")
  }
}

export const SinglePhoto: Story = {
  args: { photos: photos.slice(0, 1) },
  play: async ({ canvas }) => {
    await expectPosition(canvas, "1 / 1")
    await expect(
      canvas.queryByRole("button", { name: "Next photo" })
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole("button", { name: "Pause" })
    ).not.toBeInTheDocument()
  }
}

export const EmptyGallery: Story = {
  args: { photos: [], startId: 0 },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByText("No photos to show yet.")
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("button", { name: "Close slideshow" })
    ).toBeInTheDocument()
  }
}
