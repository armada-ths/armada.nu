import { Page } from "@/components/shared/Page"
import { organisationMembersGraphicText } from "@/i18n/dictionaries"
import { normalizeLocale } from "@armada/shared/i18n/routing"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, waitFor } from "storybook/test"

import { OrganisationMembersGraphic } from "./OrganisationMembersGraphic"

const meta = {
  title: "About/OrganisationMembersGraphic",
  component: OrganisationMembersGraphic,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    Story => (
      <Page.Boundary>
        <div className="flex w-full justify-center" data-testid="graphic-space">
          <Story />
        </div>
      </Page.Boundary>
    )
  ],
  play: async ({ canvas, canvasElement, globals }) => {
    const locale = normalizeLocale(globals.locale)
    const { title } = organisationMembersGraphicText[locale]
    const heading = canvas.getByRole("heading", { name: title })
    const graphic = canvasElement.querySelector("figure > svg")
    const guide = heading.closest("figcaption")
    const availableWidth = canvas
      .getByTestId("graphic-space")
      .getBoundingClientRect().width
    const graphicWidth = graphic?.getBoundingClientRect().width ?? 0

    await expect(heading).toBeVisible()
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4)
    await expect(graphicWidth).toBeGreaterThan(0)
    await expect(graphicWidth).toBeLessThan(availableWidth * 0.75)
    await expect(guide?.getBoundingClientRect().width).toBeCloseTo(
      graphicWidth,
      0
    )

    const animatedCircle = graphic?.querySelector("circle:nth-of-type(2)")
    const initialX = animatedCircle?.getAttribute("cx")
    await waitFor(async () => {
      await expect(animatedCircle?.getAttribute("cx")).not.toBe(initialX)
    })
  }
} satisfies Meta<typeof OrganisationMembersGraphic>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } }
}

export const SwedishMobile: Story = {
  globals: { locale: "sv", viewport: { value: "mobile", isRotated: false } }
}
