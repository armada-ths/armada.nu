import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { expect } from "storybook/test"

import { P } from "@/app/_components/Paragraph"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LocalizedText } from "@/i18n/text"

import { Page } from "./Page"

const meta = {
  title: "Shared/Page",
  component: Page.Boundary,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof Page.Boundary>

export default meta
type Story = StoryObj<typeof meta>

export const LandingLayout: Story = {
  render: () => (
    <Page.Background withIndents>
      <Page.Boundary className="gap-6 pb-16" data-testid="page-boundary">
        <Page.Header>About Armada</Page.Header>
        <P className="max-w-2xl">
          Armada connects KTH students with employers through a career fair,
          events, and year-round opportunities to meet future colleagues.
        </P>
        <Page.Header tier="secondary" className="text-melon mt-4">
          Why students keep coming back
        </Page.Header>
        <P className="max-w-2xl">
          The shared page primitives make it easy to keep typography, spacing,
          and hierarchy aligned across both exhibitor and student pages.
        </P>
        <div className="flex flex-wrap gap-3">
          <Button>Meet the team</Button>
          <Button variant="neutral">Read the blog</Button>
        </div>
      </Page.Boundary>
    </Page.Background>
  ),
  play: async ({ canvas }) => {
    const boundary = canvas.getByTestId("page-boundary")
    const styles = getComputedStyle(boundary)
    await expect(styles.maxWidth).toBe("1000px")
    await expect(styles.paddingLeft).toBe("24px")
    await expect(styles.paddingRight).toBe("24px")
    await expect(boundary.getBoundingClientRect().width).toBe(
      Math.min(1000, document.documentElement.clientWidth)
    )
    await expect(
      canvas.getByRole("heading", {
        name: "About Armada"
      })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("heading", {
        name: "Why students keep coming back"
      })
    ).toBeInTheDocument()
  }
}

export const CompactSection: Story = {
  render: () => (
    <Page.Background avoidHeader className="py-8">
      <Page.Boundary className="gap-4">
        <Page.Header tier="secondary" className="text-melon">
          Upcoming deadlines
        </Page.Header>
        <P className="max-w-xl">
          Use the compact variant when content appears inside an existing page
          flow and you do not need the standard navigation offset.
        </P>
      </Page.Boundary>
    </Page.Background>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", {
        name: "Upcoming deadlines"
      })
    ).toBeInTheDocument()
  }
}

export const ExhibitorKitMargins: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } },
  render: () => (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div
          className="flex flex-col-reverse gap-10 md:flex-row md:gap-3"
          data-testid="kit-row">
          <Card className="min-w-48 flex-1 p-5">
            <LocalizedText id="bronze" />
          </Card>
          <Card className="min-w-48 flex-1 p-5">
            <LocalizedText id="silver" />
          </Card>
          <Card className="min-w-48 flex-1 p-5">
            <LocalizedText id="gold" />
          </Card>
        </div>
      </Page.Boundary>
    </Page.Background>
  ),
  play: async ({ canvas }) => {
    const row = canvas.getByTestId("kit-row")
    const cards = [...row.querySelectorAll('[data-slot="card"]')]
    const rowBounds = row.getBoundingClientRect()
    const cardBounds = cards.map(card => card.getBoundingClientRect())
    const pageWidth = document.documentElement.clientWidth

    await expect(cards).toHaveLength(3)
    await expect(rowBounds.width).toBeCloseTo(Math.min(1000, pageWidth) - 48, 0)
    if (window.matchMedia("(min-width: 768px)").matches) {
      await expect(getComputedStyle(row).columnGap).toBe("12px")
      for (const card of cardBounds) {
        await expect(card.width).toBeCloseTo((rowBounds.width - 24) / 3, 0)
      }
    }
    await expect(rowBounds.left).toBeCloseTo(pageWidth - rowBounds.right, 0)
    await expect(Math.min(...cardBounds.map(card => card.left))).toBeCloseTo(
      rowBounds.left,
      0
    )
    await expect(Math.max(...cardBounds.map(card => card.right))).toBeCloseTo(
      rowBounds.right,
      0
    )
  }
}

export const SwedishExhibitorKitMargins: Story = {
  ...ExhibitorKitMargins,
  globals: { locale: "sv", viewport: { value: "mobile", isRotated: false } }
}
