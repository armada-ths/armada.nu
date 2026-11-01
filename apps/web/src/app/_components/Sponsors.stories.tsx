import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"

import Sponsors from "./Sponsors"

const meta = {
  title: "Homepage/Sponsors",
  component: Sponsors,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("region", { name: "Our sponsors" })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("heading", { name: "Our sponsors", level: 2 })
    ).toBeInTheDocument()
    for (const [name, href] of [
      ["Barilla", "https://www.barilla.com/sv-se"],
      ["HYD Re:hydrate", "https://hyddrinks.se/"],
      ["Estrella", "https://www.estrella.se/"]
    ]) {
      await expect(canvas.getByRole("link", { name })).toHaveAttribute(
        "href",
        href
      )
      await expect(canvas.getByRole("img", { name })).toBeVisible()
      const link = canvas.getByRole("link", { name })
      await userEvent.hover(link)
      await expect(link).toHaveStyle({ opacity: "1" })
      await userEvent.unhover(link)
    }
  }
} satisfies Meta<typeof Sponsors>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } }
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } }
}
