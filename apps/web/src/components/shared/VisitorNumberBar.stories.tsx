import type { Meta, StoryContext, StoryObj } from "@storybook/nextjs-vite"
import type { ComponentProps } from "react"
import { expect } from "storybook/test"
import en from "../../i18n/messages/en.json"
import sv from "../../i18n/messages/sv.json"

import { VisitorNumberBar } from "./VisitorNumberBar"

const meta = {
  title: "Homepage/VisitorNumberBar",
  component: VisitorNumberBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    disableAnimation: true,
    labels: en.pageTranslations.home.visitorLabels
  },
  play: async ({
    canvas,
    canvasElement,
    args: { labels },
    globals
  }: StoryContext<ComponentProps<typeof VisitorNumberBar>>) => {
    const messages = globals.locale === "sv" ? sv : en
    await expect(canvas.getByText(labels.visits)).toBeVisible()
    const exhibitorLabel = canvas.getByText(labels.exhibitors)
    await expect(exhibitorLabel).toBeVisible()
    await expect(exhibitorLabel.previousElementSibling).toHaveTextContent(
      /^80\+$/
    )
    await expect(canvas.getByText(labels.networking)).toBeVisible()
    const dayCount = canvas.getByText(messages.Static.days, { exact: false })
    await expect(dayCount).toHaveTextContent(
      new RegExp(`^2\\s+${messages.Static.days}$`)
    )

    const bar = canvasElement.firstElementChild
    if (!(bar instanceof HTMLElement)) {
      throw new Error("The statistics bar is missing")
    }
    const style = getComputedStyle(bar)
    await expect(style.borderTopWidth).toBe("2px")
    await expect(style.borderTopStyle).toBe("solid")
    await expect(style.borderBottomWidth).toBe(style.borderTopWidth)
    await expect(style.borderBottomStyle).toBe(style.borderTopStyle)
    await expect(style.borderBottomColor).toBe(style.borderTopColor)
  }
} satisfies Meta<typeof VisitorNumberBar>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } }
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } }
}

export const SwedishDesktop: Story = {
  globals: { locale: "sv", viewport: { value: "desktop", isRotated: false } },
  args: { labels: sv.pageTranslations.home.visitorLabels }
}

export const SwedishMobile: Story = {
  globals: { locale: "sv", viewport: { value: "mobile", isRotated: false } },
  args: { labels: sv.pageTranslations.home.visitorLabels }
}
