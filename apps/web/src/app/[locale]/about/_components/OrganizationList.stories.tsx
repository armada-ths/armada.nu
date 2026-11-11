import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"
import OrganizationList from "./OrganizationList"
import { TeamBoundary } from "./TeamBoundary"

const meta = {
  title: "About/OrganizationList",
  component: OrganizationList,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    Story => (
      <TeamBoundary>
        <Story />
      </TeamBoundary>
    )
  ],
  args: {
    group: {
      name: "Logistics",
      people: [
        {
          id: 1,
          name: "Anna Svensson",
          rank: "Project Group",
          role: "Head of Logistics",
          picture: "",
          email: null,
          linkedin_url: null
        },
        {
          id: 2,
          name: "Erik Andersson",
          rank: "Operation Team",
          role: "Team Leader",
          picture: "",
          email: null,
          linkedin_url: null
        },
        {
          id: 3,
          name: "Sara Nilsson",
          rank: "Host",
          role: "Host",
          picture: "",
          email: null,
          linkedin_url: null
        }
      ]
    }
  }
} satisfies Meta<typeof OrganizationList>

export default meta
type Story = StoryObj<typeof meta>

export const ExpandMembers: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("Erik Andersson")).not.toBeInTheDocument()
    await expect(canvas.queryByRole("separator")).not.toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole("button", { name: "Show additional members" })
    )
    await expect(
      canvas.getByText("Anna Svensson").closest('[data-slot="card"]')
    ).toHaveClass("sm:h-96")
    for (const name of ["Erik Andersson", "Sara Nilsson"]) {
      await expect(
        canvas.getByText(name).closest('[data-slot="card"]')
      ).not.toHaveClass("sm:h-96")
    }
    const pgCard = canvas
      .getByText("Anna Svensson")
      .closest('[data-slot="card"]')!
    const otCard = canvas
      .getByText("Erik Andersson")
      .closest('[data-slot="card"]')!
    const hostCard = canvas
      .getByText("Sara Nilsson")
      .closest('[data-slot="card"]')!
    await expect(canvas.getByRole("separator")).toBeVisible()
    const button = canvas.getByRole("button", {
      name: "Hide additional members"
    })
    await expect(otCard.getBoundingClientRect().top).toBeGreaterThan(
      pgCard.getBoundingClientRect().bottom
    )
    await expect(button.getBoundingClientRect().top).toBeGreaterThan(
      Math.max(
        otCard.getBoundingClientRect().bottom,
        hostCard.getBoundingClientRect().bottom
      )
    )
    const sectionBounds =
      pgCard.parentElement!.parentElement!.getBoundingClientRect()
    const sectionCenter = sectionBounds.left + sectionBounds.width / 2
    const expandedRowLeft = Math.min(
      otCard.getBoundingClientRect().left,
      hostCard.getBoundingClientRect().left
    )
    const buttonBounds = button.getBoundingClientRect()

    await expect(pgCard.getBoundingClientRect().left).toBeCloseTo(
      sectionBounds.left,
      0
    )
    await expect(expandedRowLeft).toBeCloseTo(sectionBounds.left, 0)
    await expect(buttonBounds.left + buttonBounds.width / 2).toBeCloseTo(
      sectionCenter,
      0
    )
    await userEvent.click(
      canvas.getByRole("button", { name: "Hide additional members" })
    )
    await expect(canvas.queryByText("Sara Nilsson")).not.toBeInTheDocument()
    await expect(canvas.queryByRole("separator")).not.toBeInTheDocument()
  }
}

export const FourCardsPerRow: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } },
  args: {
    group: {
      name: "Logistics",
      people: ["Anna", "Erik", "Karin", "Nils", "Sara"].map((name, index) => ({
        ...meta.args.group.people[0],
        id: index + 1,
        name
      }))
    }
  },
  play: async ({ canvasElement }) => checkRows(canvasElement, 4)
}

export const ThreeCardsPerRow: Story = {
  ...FourCardsPerRow,
  globals: { viewport: { value: "teamLaptop", isRotated: false } },
  parameters: {
    viewport: {
      options: {
        teamLaptop: {
          name: "Laptop (960px)",
          styles: { width: "960px", height: "900px" }
        }
      }
    }
  },
  play: async ({ canvasElement }) => checkRows(canvasElement, 3)
}

async function checkRows(canvasElement: HTMLElement, columns: number) {
  const cards = [...canvasElement.querySelectorAll('[data-slot="card"]')]
  await expect(cards).toHaveLength(5)

  const bounds = cards.map(card => card.getBoundingClientRect())
  const first = bounds[0]
  const lastInRow = bounds[columns - 1]
  const firstInNextRow = bounds[columns]
  for (const card of bounds.slice(1, columns)) {
    await expect(card.top).toBeCloseTo(first.top, 0)
  }
  await expect(firstInNextRow.top).toBeGreaterThan(first.top)
  await expect(firstInNextRow.left).toBeCloseTo(first.left, 0)
  await expect(first.left).toBeCloseTo(
    document.documentElement.clientWidth - lastInRow.right,
    0
  )
}

export const SwedishMobile: Story = {
  args: { group: { ...meta.args.group, nameSv: "Logistik" } },
  globals: { locale: "sv", viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Logistik" })
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole("button", { name: "Visa fler medlemmar" })
    )
    await expect(canvas.getByText("Sara Nilsson")).toBeVisible()
  }
}
