import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent } from "storybook/test"

import { EmailListSignup } from "./EmailListSignup"

const CAMPAIGN_ID = "123e4567-e89b-12d3-a456-426614174000"
const EVENTRO_SIGNUP_URL =
  "https://app.eventro.se/api/v1/register-email-campaign-user"

const meta = {
  title: "Recruitment/EmailListSignup",
  component: EmailListSignup,
  parameters: {
    layout: "centered"
  },
  decorators: [
    Story => (
      <div className="w-[min(48rem,90vw)]">
        <Story />
      </div>
    )
  ],
  args: {
    campaignId: CAMPAIGN_ID
  }
} satisfies Meta<typeof EmailListSignup>

export default meta
type Story = StoryObj<typeof meta>

export const SendsEventroPayloadWithoutEmptyName: Story = {
  play: async ({ canvas }) => {
    const originalFetch = globalThis.fetch
    const fetchMock = fn(
      async () => new Response(JSON.stringify({ success: true }))
    )
    globalThis.fetch = fetchMock as typeof fetch

    try {
      await userEvent.type(canvas.getByLabelText(/^email$/i), "ada@example.com")
      await userEvent.click(canvas.getByRole("button", { name: /notify me/i }))

      await expect(
        await canvas.findByText(/you're subscribed/i)
      ).toBeInTheDocument()
      await expect(fetchMock).toHaveBeenCalledWith(EVENTRO_SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          campaignId: CAMPAIGN_ID,
          email: "ada@example.com"
        })
      })
    } finally {
      globalThis.fetch = originalFetch
    }
  }
}
