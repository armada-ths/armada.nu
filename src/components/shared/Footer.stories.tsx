import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { expect } from "storybook/test"

import { Footer } from "./Footer"

const meta = {
  title: "Shared/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  args: {
    signupUrl: "/exhibitor/signup"
  },
  render: args => (
    <div className="flex min-h-136 flex-col justify-end">
      <Footer {...args} />
    </div>
  )
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText("Follow us on:")[0]).toBeInTheDocument()
    await expect(
      canvas.getByRole("link", {
        name: "Registration"
      })
    ).toHaveAttribute("href", "/exhibitor/signup")
    await expect(
      canvas.getByRole("img", {
        name: "Sture Logo"
      })
    ).toBeInTheDocument()
  }
}

export const ExternalRegistration: Story = {
  args: {
    signupUrl: "https://app.eventro.se/register/armada"
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", {
        name: "Registration"
      })
    ).toHaveAttribute("href", "https://app.eventro.se/register/armada")
  }
}
