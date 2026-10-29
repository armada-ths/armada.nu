import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"
import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import GoldExhibitors from "./GoldExhibitors"

const exhibitors: Exhibitor[] = [
  {
    id: 1,
    name: "Northstar Engineering",
    type: "Company",
    tier: "Gold",
    fairLocation: "Nymble",
    climateCompensation: false,
    logoFreesize: "/armada_licorice.svg",
    companyWebsite: "https://example.com/engineering",
    about:
      "Meet our engineers and explore opportunities in sustainable technology."
  },
  {
    id: 2,
    name: "Harbour Systems",
    type: "Company",
    tier: "Gold",
    fairLocation: "Nymble",
    climateCompensation: false,
    logoFreesize: "/armada_licorice.svg",
    about: "Build the next generation of connected systems with us."
  }
]

const meta = {
  title: "Homepage/GoldExhibitors",
  component: GoldExhibitors,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    Story => (
      <div className="bg-coconut px-12 sm:px-16">
        <h1 className="sr-only">Armada homepage</h1>
        <Story />
      </div>
    )
  ],
  args: { exhibitors }
} satisfies Meta<typeof GoldExhibitors>

export default meta
type Story = StoryObj<typeof meta>

export const ThumbnailOnly: Story = {
  args: {
    exhibitors: [
      {
        ...exhibitors[0],
        logoFreesize: undefined,
        logoThumbnail: "/armada_licorice.svg"
      }
    ]
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("img", { name: "Northstar Engineering logo" })
    ).toHaveAttribute("src", expect.stringContaining("armada_licorice.svg"))
  }
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Gold Exhibitors", level: 2 })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("link", { name: "Northstar Engineering" })
    ).toHaveAttribute("href", "https://example.com/engineering")
    await expect(
      canvas.getByRole("heading", { name: "Northstar Engineering", level: 3 })
    ).toBeInTheDocument()
    const secondSlide = await canvas.findByRole("button", {
      name: "Go to slide 2"
    })
    await userEvent.click(secondSlide)
    await expect(secondSlide).toHaveAttribute("aria-current", "true")
    const firstSlide = canvas.getByRole("button", { name: "Go to slide 1" })
    await userEvent.click(firstSlide)
    await expect(firstSlide).toHaveAttribute("aria-current", "true")
  }
}

export const LongDescription: Story = {
  args: {
    exhibitors: [
      {
        ...exhibitors[0],
        about:
          "Explore careers in engineering, design and sustainable technology. ".repeat(
            24
          )
      }
    ]
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Read more" }))
    await expect(
      canvas.getByText(
        "Explore careers in engineering, design and sustainable technology. "
          .repeat(24)
          .trim()
      )
    ).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: "Read less" }))
    await expect(
      canvas.getByRole("button", { name: "Read more" })
    ).toBeInTheDocument()
  }
}

export const WithoutLogoOrWebsite: Story = {
  args: {
    exhibitors: [
      { ...exhibitors[0], logoFreesize: undefined, companyWebsite: undefined }
    ]
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Northstar Engineering" })
    ).toBeInTheDocument()
    await expect(canvas.queryByRole("img")).not.toBeInTheDocument()
    await expect(canvas.queryByRole("link")).not.toBeInTheDocument()
  }
}
