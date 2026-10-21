import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { CookieInformation } from "@armada/shared/CookieInformation"

const meta = {
  title: "Shared/CookieInformation",
  component: CookieInformation,
  tags: ["autodocs"],
  args: { site: "web" },
  decorators: [
    Story => (
      <div className="mx-auto max-w-3xl p-6">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof CookieInformation>
export default meta
type Story = StoryObj<typeof meta>
export const Web: Story = {}
export const Photos: Story = {
  args: { site: "photos" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Upload limits: armada-photo-guest" })
    ).toBeVisible()
    await expect(canvas.getByText(/no automatic expiry/)).toBeVisible()
  }
}
export const Order: Story = {
  args: { site: "order" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Access to the order form: _ea" })
    ).toBeVisible()
    await expect(canvas.getByText(/expires seven days/)).toBeVisible()
    await expect(canvas.queryByText(/_GRECAPTCHA/)).not.toBeInTheDocument()
  }
}
