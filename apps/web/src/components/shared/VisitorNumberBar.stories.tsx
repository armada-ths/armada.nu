import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { VisitorNumberBar } from "./VisitorNumberBar"

const meta = {
  title: "Homepage/VisitorNumberBar",
  component: VisitorNumberBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { disableAnimation: true },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("visits")).toBeVisible()
    await expect(canvas.getByText("Students")).toBeVisible()
    await expect(canvas.getByText("of networking")).toBeVisible()

    const bar = canvasElement.firstElementChild
    if (!(bar instanceof HTMLElement)) {
      throw new Error("The statistics bar is missing")
    }
    const style = getComputedStyle(bar)
    await expect(style.borderTopWidth).toBe("2px")
    await expect(style.borderTopStyle).toBe("solid")
    await expect(style.borderBottomWidth).toBe(style.borderTopWidth)
    await expect(style.borderBottomStyle).toBe(style.borderTopStyle)
    await expect(style.borderBottomColor).toBe(style.borderTopColor)
  }
} satisfies Meta<typeof VisitorNumberBar>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } }
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } }
}
