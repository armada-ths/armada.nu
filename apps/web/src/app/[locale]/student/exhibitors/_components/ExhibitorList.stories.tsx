import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"
import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { PLACEMENTS } from "@/components/map/maps"
import ExhibitorList from "./ExhibitorList"

const companyWebsite = "https://careers.example.com/engineering"
const msabPlacementId = PLACEMENTS.find(
  placement => placement.name === "MSAB"
)?.id

const exhibitors: Exhibitor[] = [
  {
    id: 1,
    name: "Visible Company",
    type: "Company",
    tier: "Gold",
    climateCompensation: false
  },
  {
    id: 14651,
    eventroId: msabPlacementId,
    name: "Linked Company",
    type: "Company",
    tier: "Silver",
    climateCompensation: false,
    about: "Meet us at Armada.",
    companyWebsite
  }
]

const meta = {
  title: "Student/ExhibitorList",
  component: ExhibitorList,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en/student/exhibitors" }
    }
  },
  args: { exhibitors, visibleExhibitors: exhibitors }
} satisfies Meta<typeof ExhibitorList>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(2)
  }
}

export const DirectLinkOutsideFilter: Story = {
  args: { visibleExhibitors: [exhibitors[0]] },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en/student/exhibitors", query: { id: "14651" } }
    }
  },
  play: async ({ canvas }) => {
    const dialog = await within(document.body).findByRole("dialog")
    await expect(
      await within(dialog).findByText("Linked Company")
    ).toBeInTheDocument()
    await expect(
      canvas.queryByRole("heading", { level: 3, name: "Linked Company" })
    ).not.toBeInTheDocument()
    await expect(within(document.body).getAllByRole("dialog")).toHaveLength(1)
    await expect(
      within(dialog).queryByRole("link", { name: "Show on map" })
    ).not.toBeInTheDocument()
  }
}

export const SwedishModalMapLink: Story = {
  globals: { locale: "sv" },
  args: { mapEnabled: true },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/sv/student/exhibitors", query: { id: "14651" } }
    }
  },
  play: async ({ canvas }) => {
    const dialog = await within(document.body).findByRole("dialog")
    const mapLink = await within(dialog).findByRole("link", {
      name: "Visa på karta"
    })
    await expect(mapLink).toHaveAttribute(
      "href",
      `/sv/student/map?id=${msabPlacementId}`
    )
    const modal = within(dialog)
    const heading = modal.getByRole("heading", { name: "Linked Company" })
    const website = modal.getByRole("link", { name: companyWebsite })
    await expect(website).toHaveAttribute("href", companyWebsite)
    await document.fonts.ready
    const headingRect = heading.getBoundingClientRect()
    const websiteRect = website.getBoundingClientRect()
    const mapLinkRect = mapLink.getBoundingClientRect()
    await expect(mapLinkRect.top).toBeCloseTo(headingRect.top)
    await expect(mapLinkRect.left).toBeGreaterThan(
      Math.max(headingRect.right, websiteRect.right) + 24
    )
    await expect(
      canvas.queryByRole("link", { name: "Visa på karta", hidden: true })
    ).not.toBeInTheDocument()
  }
}
