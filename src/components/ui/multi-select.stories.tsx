import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { MultiSelect } from "./multi-select"

const options = [
  { value: "tech", label: "Technology & Software Development" },
  { value: "engineering", label: "Engineering & Manufacturing" },
  { value: "sustainability", label: "Energy & Sustainability" },
  { value: "telecom", label: "Telecommunications & IT" }
]

const meta = {
  title: "UI/MultiSelect",
  component: MultiSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="w-64">
        <Story />
      </div>
    )
  ],
  args: {
    options,
    onValueChange: fn(),
    placeholder: "Filter by Industry"
  }
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole("combobox", {
      name: /Filter by Industry/
    })

    await userEvent.click(trigger)
    const listbox = await within(document.body).findByRole("listbox", {
      name: "Available options"
    })
    await userEvent.click(
      within(listbox).getByRole("option", {
        name: /Technology & Software Development, not selected/
      })
    )

    await expect(args.onValueChange).toHaveBeenCalledWith(["tech"])
    await expect(
      canvas.getByText("Technology & Software Development")
    ).toBeInTheDocument()
  }
}

export const LongSelectedValues: Story = {
  args: {
    defaultValue: ["tech", "engineering", "sustainability"],
    maxCount: 3
  },
  play: async ({ canvas }) => {
    const label = canvas.getByText("Technology & Software Development")
    const badge = label.closest<HTMLElement>("[data-slot='badge']")
    const trigger = canvas.getByRole("combobox", {
      name: /Filter by Industry/
    })

    await expect(badge).not.toBeNull()
    if (!badge) return

    await userEvent.hover(badge)
    await expect(getComputedStyle(badge).transform).toBe("none")
    await expect(badge.getBoundingClientRect().right).toBeLessThanOrEqual(
      trigger.getBoundingClientRect().right
    )
  }
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("combobox", { name: /Filter by Industry/ })
    ).toBeDisabled()
  }
}
