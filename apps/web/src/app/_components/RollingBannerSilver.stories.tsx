import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import RollingBannerSilver from "./RollingBannerSilver"

const meta = {
  title: "Homepage/RollingBannerSilver",
  component: RollingBannerSilver,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    Story => (
      <div className="bg-coconut mx-auto max-w-6xl px-5">
        <Story />
      </div>
    )
  ],
  args: {
    // Small sample logos need more entries than the wider company logos in production.
    logos: Array.from(
      { length: 72 },
      (_, index) =>
        ["/armada_licorice.svg", "/sture-logo-up.png", "/LogoDCS-300dpi.png"][
          index % 3
        ]
    )
  }
} satisfies Meta<typeof RollingBannerSilver>

export default meta
type Story = StoryObj<typeof meta>

async function checkAnimationCoverage(canvasElement: HTMLElement) {
  await Promise.all(
    Array.from(canvasElement.querySelectorAll("img"), image => image.decode())
  )
  const rows = canvasElement.querySelectorAll<HTMLElement>(
    "section .overflow-hidden"
  )
  for (const row of rows) {
    const track = row.firstElementChild as HTMLElement
    const animation = track.getAnimations()[0]
    await animation.ready
    const originalTime = animation.currentTime
    animation.pause()
    const duration = Number(animation.effect?.getTiming().duration)
    try {
      for (const progress of [0, 0.25, 0.5, 0.75, 0.999]) {
        animation.currentTime = duration * progress
        const viewport = row.getBoundingClientRect()
        const content = track.getBoundingClientRect()
        await expect(content.left).toBeLessThanOrEqual(viewport.left + 1)
        await expect(content.right).toBeGreaterThanOrEqual(viewport.right - 1)
      }
    } finally {
      animation.currentTime = originalTime
      // eslint-disable-next-line storybook/context-in-play-function -- Resumes a Web Animation, not a story.
      animation.play()
    }
  }
}

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole("heading", { name: "Silver Exhibitors" })
    ).toBeInTheDocument()
    await expect(canvas.getAllByRole("img")).toHaveLength(144)
    await checkAnimationCoverage(canvasElement)
  }
}

export const SingleLogo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "One source logo is rendered twice by the component to support its scrolling loop. This deliberately sparse case shows the existing component behavior."
      }
    }
  },
  args: { logos: ["/armada_licorice.svg"] },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("img")).toHaveLength(2)
  }
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } }
}

export const WideScreen: Story = {
  parameters: {
    viewport: {
      options: {
        bannerWide: {
          name: "Wide banner (2880px)",
          styles: { width: "2880px", height: "900px" }
        }
      }
    }
  },
  globals: { viewport: { value: "bannerWide", isRotated: false } },
  play: async ({ canvasElement }) => {
    await checkAnimationCoverage(canvasElement)
  }
}

export const Empty: Story = {
  args: { logos: [] },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Silver Exhibitors" })
    ).toBeInTheDocument()
    await expect(canvas.queryByRole("img")).not.toBeInTheDocument()
  }
}
