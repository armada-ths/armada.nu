import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent } from "storybook/test"

import { Page } from "@/components/shared/Page"
import FloorSelector from "./FloorSelector"

const meta = {
  title: "Student/FloorSelector",
  component: FloorSelector,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    floors: ["Nymble plan 2", "Nymble plan 3"],
    selectedFloor: "Nymble plan 2",
    onSelect: fn()
  },
  decorators: [
    Story => (
      <Page.Boundary className="mt-0">
        <div className="relative h-60" data-testid="map-frame">
          <Story />
        </div>
      </Page.Boundary>
    )
  ]
} satisfies Meta<typeof FloorSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Mobile: Story = {
  globals: { locale: "sv", viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas, args }) => {
    const frame = canvas.getByTestId("map-frame").getBoundingClientRect()
    for (const floor of canvas.getAllByRole("button")) {
      const { left, right } = floor.getBoundingClientRect()
      await expect(left).toBeGreaterThanOrEqual(frame.left)
      await expect(right).toBeLessThanOrEqual(frame.right)
    }

    await userEvent.click(canvas.getByRole("button", { name: "Nymble plan 3" }))
    await expect(args.onSelect).toHaveBeenCalledWith("Nymble plan 3")
  }
}
