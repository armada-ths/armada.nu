import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"
import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import ExhibitorList from "./ExhibitorList"

const exhibitors: Exhibitor[] = [
  {
    id: 1,
    name: "Visible Company",
    type: "Company",
    tier: "Gold",
    fairLocation: "Nymble",
    climateCompensation: false
  },
  {
    id: 2,
    name: "Linked Company",
    type: "Company",
    tier: "Silver",
    fairLocation: "Nymble",
    climateCompensation: false,
    about: "Meet us at Armada."
  }
]

const meta = {
  title: "Student/ExhibitorList",
  component: ExhibitorList,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/student/exhibitors" }
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
      navigation: { pathname: "/student/exhibitors", query: { id: "2" } }
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
  }
}
