import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { PhotosHeader } from "./PhotosHeader"

const meta = {
  title: "Photos/Header",
  component: PhotosHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" }
} satisfies Meta<typeof PhotosHeader>

export default meta
type Story = StoryObj<typeof meta>

export const English: Story = {
  globals: { locale: "en" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Switch language to Swedish" })
    ).toHaveTextContent("Svenska")
    await expect(
      canvas.getByRole("link", { name: "THS Armada" })
    ).toHaveAttribute("href", "https://armada.nu/en")
  }
}

export const Swedish: Story = {
  globals: { locale: "sv" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Byt språk till engelska" })
    ).toHaveTextContent("English")
    await expect(
      canvas.getByRole("link", { name: "THS Armada" })
    ).toHaveAttribute("href", "https://armada.nu/sv")
  }
}
