import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { DateTime } from "luxon"
import { expect } from "storybook/test"

import { CountdownCard } from "./Countdown"

const meta = {
  title: "Home/Countdown",
  component: CountdownCard,
  tags: ["autodocs"],
  args: { fairDays: ["2026-11-17", "2026-11-18"] },
  decorators: [
    Story => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof CountdownCard>

export default meta
type Story = StoryObj<typeof meta>

const lastFairDay = DateTime.now()
  .setZone("Europe/Stockholm")
  .minus({ days: 1 })
const firstFairDay = lastFairDay.minus({ days: 1 })

export const FairEnded: Story = {
  args: { fairDays: [firstFairDay.toISODate()!, lastFairDay.toISODate()!] },
  play: async ({ canvas }) => {
    const date = canvas.getByText(
      new RegExp(`\\b${lastFairDay.year} \\| Nymble, KTH$`)
    )
    await expect(date).toBeVisible()
    await expect(date.parentElement?.children).toHaveLength(1)
  }
}

export const FairEndedSwedishMobile: Story = {
  args: { fairDays: ["2025-11-18", "2025-11-19"] },
  globals: { locale: "sv", viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas }) => {
    const date = canvas.getByText("18–19 nov. 2025 | Nymble, KTH")
    await expect(date).toBeVisible()
    await expect(date.parentElement?.children).toHaveLength(1)
  }
}
