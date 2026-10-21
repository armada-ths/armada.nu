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
    logos: Array.from(
      { length: 24 },
      (_, index) =>
        ["/armada_licorice.svg", "/sture-logo-up.png", "/LogoDCS-300dpi.png"][
          index % 3
        ]
    )
  }
} satisfies Meta<typeof RollingBannerSilver>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Silver Exhibitors" })
    ).toBeInTheDocument()
    await expect(canvas.getAllByRole("img")).toHaveLength(48)
  }
}

export const SingleLogo: Story = {
  args: { logos: ["/armada_licorice.svg"] },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("img")).toHaveLength(2)
  }
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } }
}
