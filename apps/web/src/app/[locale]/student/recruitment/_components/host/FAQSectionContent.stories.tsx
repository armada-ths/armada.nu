import { Page } from "@/components/shared/Page"
import { hostFaqText } from "@/i18n/dictionaries"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"

import { FAQSectionContent } from "./FAQSectionContent"

const meta = {
  title: "Recruitment/Host FAQ",
  component: FAQSectionContent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    locale: "en",
    fairDays: ["2026-11-17", "2026-11-18"]
  },
  decorators: [
    Story => (
      <Page.Boundary>
        <div className="flex flex-col" data-testid="recruitment-content">
          <Story />
        </div>
      </Page.Boundary>
    )
  ],
  play: async ({ args, canvas }) => {
    const { timeQuestion, timeIntro } = hostFaqText[args.locale]
    const question = canvas.getByRole("button", { name: timeQuestion })
    const item = question.closest('[data-slot="accordion-item"]')
    const section = canvas.getByTestId("recruitment-content")
    await expect(item?.getBoundingClientRect().width).toBeCloseTo(
      section.getBoundingClientRect().width
    )
    await userEvent.click(question)
    await expect(canvas.getByText(timeIntro)).toBeVisible()
  }
} satisfies Meta<typeof FAQSectionContent>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } }
}

export const SwedishMobile: Story = {
  args: { locale: "sv" },
  globals: { locale: "sv", viewport: { value: "mobile", isRotated: false } }
}
