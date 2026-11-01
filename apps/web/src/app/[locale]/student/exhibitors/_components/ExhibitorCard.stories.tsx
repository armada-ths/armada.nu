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
      fairLocation: "Nymble",
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
