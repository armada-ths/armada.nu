import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import PersonCard from "./PersonCard"

const meta = {
  title: "About/PersonCard",
  component: PersonCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="w-56">
        <Story />
      </div>
    )
  ],
  args: {
    person: {
      id: 1,
      name: "Anna Svensson",
      rank: "Project Group",
      role: "Head of Logistics",
      picture: "",
      email: "anna@armada.nu",
      linkedin_url: null
    }
  }
} satisfies Meta<typeof PersonCard>

export default meta
type Story = StoryObj<typeof meta>

export const ProjectGroupWithoutPicture: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("svg")).toHaveClass("h-20")
    await expect(canvasElement.querySelector('[data-slot="card"]')).toHaveClass(
      "sm:h-96"
    )
  }
}

export const OperationTeamWithoutPicture: Story = {
  args: {
    compactWithoutPicture: true,
    person: { ...meta.args.person, rank: "Operation Team", role: "Logistics" }
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Anna Svensson")).toBeInTheDocument()
    await expect(canvas.getByText("Logistics")).toBeInTheDocument()
    await expect(canvas.getByRole("link")).toHaveAttribute(
      "href",
      "mailto:anna@armada.nu"
    )
    await expect(canvasElement.querySelector(".aspect-square.w-52")).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="card"]')
    ).not.toHaveClass("sm:h-96")
  }
}

export const HostWithPlaceholder: Story = {
  ...OperationTeamWithoutPicture,
  args: {
    compactWithoutPicture: true,
    person: {
      ...meta.args.person,
      rank: "Host",
      role: "Logistics",
      picture: "/no-image.png"
    }
  }
}

export const OperationTeamWithPicture: Story = {
  args: {
    compactWithoutPicture: true,
    person: {
      ...meta.args.person,
      rank: "Operation Team",
      role: "Logistics",
      picture: "/fair_pictures/2.jpeg"
    }
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole("img", { name: "Anna Svensson" })
    ).toBeInTheDocument()
    await expect(canvasElement.querySelector('[data-slot="card"]')).toHaveClass(
      "sm:h-96"
    )
  }
}
