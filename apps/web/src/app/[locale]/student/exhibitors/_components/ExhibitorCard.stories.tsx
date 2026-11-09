import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { ExhibitorCard } from "./ExhibitorCard"

const meta = {
  title: "Student/ExhibitorCard",
  component: ExhibitorCard,
  tags: ["autodocs"],
  parameters: { nextjs: { appDirectory: true } },
  args: {
    exhibitor: {
      id: 1,
      name: "Example Company",
      type: "company",
      climateCompensation: false,
      logoThumbnail: "/armada_licorice.svg",
      logoFreesize: "/unused-original.png"
    }
  }
} satisfies Meta<typeof ExhibitorCard>
export default meta
type Story = StoryObj<typeof meta>

export const Thumbnail: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("img", { name: "Example Company" })
    ).toHaveAttribute("src", expect.stringContaining("armada_licorice.svg"))
  }
}

export const OriginalFallback: Story = {
  args: {
    exhibitor: {
      ...meta.args.exhibitor,
      logoThumbnail: undefined,
      logoFreesize: "/armada_licorice.svg"
    }
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("img", { name: "Example Company" })
    ).toHaveAttribute("src", expect.stringContaining("armada_licorice.svg"))
  }
}

export const SwedishMapLink: Story = {
  globals: { locale: "sv" },
  args: { showMapLink: true },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Visa på karta" })
    await expect(link).toHaveAttribute("href", "/sv/student/map?id=1")
    await expect(
      canvas.getByRole("link", { name: /Example Company/ })
    ).toHaveAttribute("href", "/sv/student/exhibitors?id=1")
  }
}
