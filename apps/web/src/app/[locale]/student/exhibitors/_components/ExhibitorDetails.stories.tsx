import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import ExhibitorDetails from "./ExhibitorDetails"

const meta = {
  title: "Student/ExhibitorDetails",
  component: ExhibitorDetails,
  tags: ["autodocs"],
  args: {
    exhibitor: {
      id: 1,
      name: "Example Engineering",
      type: "company",
      fairLocation: "Nymble",
      climateCompensation: false,
      logoThumbnail: "/armada_licorice.svg",
      logoFreesize: "/unused-original.png",
      cities: "Göteborg, Stockholm",
      about: "Engineering opportunities across Sweden."
    }
  }
} satisfies Meta<typeof ExhibitorDetails>

export default meta
type Story = StoryObj<typeof meta>

export const WithLocationsAndThumbnail: Story = {
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole("heading", { name: "Locations" })
    ).toBeVisible()
    await expect(canvas.getByText("Göteborg, Stockholm")).toBeVisible()
    await expect(
      canvas.getByRole("img", { name: "Example Engineering" })
    ).toHaveAttribute("src", expect.stringContaining("armada_licorice.svg"))
  }
}

export const MissingOptionalData: Story = {
  args: {
    exhibitor: {
      id: 2,
      name: "Minimal company",
      type: "company",
      fairLocation: "Nymble",
      climateCompensation: false
    }
  },
  play: async ({ canvas }) => {
    await canvas.findByText("Minimal company")
    await expect(
      canvas.queryByRole("heading", { name: "Locations" })
    ).not.toBeInTheDocument()
    await expect(canvas.queryByRole("img")).not.toBeInTheDocument()
  }
}
