import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { LanguageSwitcher } from "@armada/shared/i18n/client"

const meta = {
  title: "Navigation/LanguageSwitcher",
  component: LanguageSwitcher,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    Story => (
      <div className="bg-melon p-8">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const English: Story = {
  globals: { locale: "en" },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", {
      name: "Switch language to Swedish"
    })
    await expect(button).toHaveTextContent("Svenska")
    await userEvent.tab()
    await expect(button).toHaveFocus()
  }
}

export const Swedish: Story = {
  globals: { locale: "sv" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", {
      name: "Byt språk till engelska"
    })
    await expect(button).toHaveTextContent("English")
  }
}
