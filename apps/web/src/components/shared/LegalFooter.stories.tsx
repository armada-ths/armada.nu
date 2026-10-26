import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { LegalFooter } from "@armada/shared/LegalFooter"

const meta = {
  title: "Shared/LegalFooter",
  component: LegalFooter,
  tags: ["autodocs"],
  args: { site: "photos" },
  parameters: { layout: "fullscreen" }
} satisfies Meta<typeof LegalFooter>
export default meta
type Story = StoryObj<typeof meta>
export const Photos: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", { name: "Cookies & browser storage" })
    ).toHaveAttribute("href", "/privacy#cookies")
    await expect(
      canvas.getByRole("link", { name: "Privacy notice" })
    ).toHaveAttribute("href", "/privacy")
  }
}
export const Order: Story = {
  args: { site: "order" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", { name: "Cookies & browser storage" })
    ).toHaveAttribute("href", "/cookies")
  }
}
