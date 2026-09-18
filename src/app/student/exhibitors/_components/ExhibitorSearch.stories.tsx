import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import type {
  Employment,
  Exhibitor,
  Industry,
  Program
} from "@/components/shared/hooks/api/useExhibitors"

import ExhibitorSearch from "./ExhibitorSearch"

const internship: Employment = { id: 1, name: "Internship" }
const software: Industry = {
  id: 1,
  name: "Technology & Software Development"
}
const engineering: Program = { id: 1, name: "Engineering Physics" }

const exhibitors: Exhibitor[] = [
  {
    id: 1,
    name: "Beta Industries",
    type: "Company",
    tier: "Gold",
    fairLocation: "Nymble",
    climateCompensation: false,
    employments: [internship],
    industries: [software],
    programs: [engineering]
  },
  {
    id: 2,
    name: "Alpha Systems",
    type: "Company",
    tier: "Bronze",
    fairLocation: "Nymble",
    climateCompensation: false,
    employments: [],
    industries: [],
    programs: []
  },
  {
    id: 3,
    name: "Gamma Group",
    type: "Company",
    tier: "Silver",
    fairLocation: "Nymble",
    climateCompensation: false,
    employments: [],
    industries: [],
    programs: []
  }
]

const meta = {
  title: "Student/ExhibitorSearch",
  component: ExhibitorSearch,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="bg-coconut min-h-screen px-5">
        <Story />
      </div>
    )
  ],
  args: {
    exhibitors,
    employments: [internship],
    industries: [software],
    programs: [engineering]
  }
} satisfies Meta<typeof ExhibitorSearch>

export default meta
type Story = StoryObj<typeof meta>

export const FilteringAndSorting: Story = {
  play: async ({ canvas }) => {
    const searchInput = canvas.getByPlaceholderText("Search by company name")
    const companyHeadings = canvas.getAllByRole("heading", { level: 3 })
    await expect(companyHeadings[0]).toHaveTextContent("Beta Industries")

    const sortTrigger = canvas.getByRole("combobox", {
      name: "Sort exhibitors by"
    })
    await userEvent.click(sortTrigger)

    await userEvent.click(searchInput)
    await expect(searchInput).toHaveFocus()
    await expect(sortTrigger).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(sortTrigger)
    await userEvent.click(
      await within(document.body).findByRole("option", { name: "Name: A-Z" })
    )

    await waitFor(() => {
      expect(canvas.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent(
        "Alpha Systems"
      )
    })

    const industryTrigger = canvas.getByRole("combobox", {
      name: /Filter by Industry/
    })
    await userEvent.click(industryTrigger)
    const industryListbox = await within(document.body).findByRole("listbox", {
      name: "Available options"
    })
    await userEvent.click(
      within(industryListbox).getByRole("option", {
        name: /Technology & Software Development, not selected/
      })
    )
    await userEvent.click(
      within(document.body).getByRole("button", { name: "Close" })
    )

    const removeIndustry = canvas.getByRole("button", {
      name: /Remove Technology & Software Development/
    })
    const industryBadge = removeIndustry.closest<HTMLElement>(
      "[data-slot='badge']"
    )
    await expect(industryBadge).not.toBeNull()
    if (!industryBadge) return

    const badgeBeforeHover = industryBadge.getBoundingClientRect()
    await userEvent.hover(removeIndustry)
    await new Promise(resolve => setTimeout(resolve, 350))
    const badgeAfterHover = industryBadge.getBoundingClientRect()

    await expect(badgeAfterHover.width).toBe(badgeBeforeHover.width)
    await expect(badgeAfterHover.height).toBe(badgeBeforeHover.height)
    await expect(
      Math.abs(badgeAfterHover.x - badgeBeforeHover.x)
    ).toBeLessThanOrEqual(1.1)
    await expect(
      Math.abs(badgeAfterHover.y - badgeBeforeHover.y)
    ).toBeLessThanOrEqual(1.1)

    await userEvent.click(removeIndustry)

    await userEvent.type(searchInput, "Gamma")
    await expect(canvas.getByText("Gamma Group")).toBeInTheDocument()
    await expect(canvas.queryByText("Alpha Systems")).not.toBeInTheDocument()
  }
}
