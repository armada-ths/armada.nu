import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"
import OrganizationList from "./OrganizationList"

const meta = {
  title: "About/OrganizationList",
  component: OrganizationList,
  tags: ["autodocs"],
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
    const buttonBounds = button.getBoundingClientRect()
    const sectionBounds =
      pgCard.parentElement!.parentElement!.getBoundingClientRect()
    await expect(
      Math.abs(
        buttonBounds.left +
          buttonBounds.width / 2 -
          sectionBounds.left -
          sectionBounds.width / 2
      )
    ).toBeLessThan(2)
    await userEvent.click(
      canvas.getByRole("button", { name: "Hide additional members" })
    )
    await expect(canvas.queryByText("Sara Nilsson")).not.toBeInTheDocument()
    await expect(canvas.queryByRole("separator")).not.toBeInTheDocument()
  }
}
