import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor } from "storybook/test"
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

export const IndependentExpansion: Story = {
  args: {
    exhibitors: exhibitors.map(exhibitor => ({
      ...exhibitor,
      about:
        "Explore careers in engineering and sustainable technology. ".repeat(40)
    }))
  },
  play: async ({ canvas, canvasElement }) => {
    const cards =
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="card"]')
    const secondHeight = cards[1].getBoundingClientRect().height
    const buttons = canvas.getAllByRole("button", { name: "Read more" })
    await expect(buttons[1]).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(buttons[0])
    await expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
    await expect(buttons[1]).toHaveAttribute("aria-expanded", "false")
    await expect(cards[1].getBoundingClientRect().height).toBe(secondHeight)
    await expect(cards[0].getBoundingClientRect().height).toBeGreaterThan(
      secondHeight
    )
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]'
    )!
    const expectActiveHeight = async (index: number) => {
      await waitFor(async () => {
        await expect(viewport.clientHeight).toBe(cards[index].offsetHeight + 4)
      })
    }
    await expectActiveHeight(0)
    await userEvent.click(canvas.getByRole("button", { name: "Go to slide 2" }))
    await expectActiveHeight(1)
    await userEvent.click(canvas.getByRole("button", { name: "Go to slide 1" }))
    await expectActiveHeight(0)
    await expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
    await userEvent.click(buttons[0])
    await expect(buttons[0]).toHaveAttribute("aria-expanded", "false")
    await expectActiveHeight(0)
  }
}

export const EqualCollapsedHeights: Story = {
  args: {
    exhibitors: [
      { ...exhibitors[0], about: "Meet us at Armada." },
      {
        ...exhibitors[1],
        name: "Harbour Systems Engineering and Sustainable Technology",
        about: "Explore careers in sustainable technology. ".repeat(40)
      },
      {
        ...exhibitors[0],
        id: 3,
        name: "Without logo",
        logoFreesize: undefined,
        about: "Welcome!"
      }
    ]
  },
  play: async ({ canvasElement }) => {
    const cards = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="card"]')
    )
    await waitFor(async () => {
      await expect(cards[0].offsetHeight).toBeGreaterThan(0)
      await expect(new Set(cards.map(card => card.offsetHeight)).size).toBe(1)
    })
  }
}
