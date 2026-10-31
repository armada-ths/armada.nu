import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fireEvent, userEvent, waitFor } from "storybook/test"
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
  args: { exhibitors },
  beforeEach: () => {
    const original = Math.random
    Math.random = () => 0.999
    return () => {
      Math.random = original
    }
  }
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

export const FlexibleDescriptionSpace: Story = {
  args: {
    exhibitors: [
      {
        ...exhibitors[0],
        about: "Meet us at Armada and explore careers. ".repeat(40)
      },
      {
        ...exhibitors[1],
        name: "Harbour Systems Engineering and Sustainable Technology Research and Development",
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
    const spaces = canvasElement.querySelectorAll<HTMLElement>(
      "[data-gold-description]"
    )
    await waitFor(async () => {
      await expect(new Set(cards.map(card => card.offsetHeight)).size).toBe(1)
      await expect(spaces[1].clientHeight).toBeLessThan(spaces[0].clientHeight)
      for (const space of spaces) {
        const description = space.querySelector("p")!
        await expect(description.clientHeight).toBeLessThanOrEqual(
          space.clientHeight
        )
      }
    })
  }
}

export const ExpandedPausesAutoplay: Story = {
  args: IndependentExpansion.args,
  play: async ({ canvas }) => {
    const firstSlide = await canvas.findByRole("button", {
      name: "Go to slide 1"
    })
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Read more" })[0]
    )
    await expect(
      canvas.getByRole("button", { name: "Play slideshow" })
    ).toBeEnabled()
    // Move focus and pointer outside the carousel so hover/focus cannot pause it.
    await userEvent.click(
      canvas.getByRole("heading", { name: "Gold Exhibitors" })
    )
    await new Promise(resolve => setTimeout(resolve, 6500))
    await expect(firstSlide).toHaveAttribute("aria-current", "true")
    await expect(
      canvas.getByRole("button", { name: "Read less" })
    ).toHaveAttribute("aria-expanded", "true")
    await userEvent.click(canvas.getByRole("button", { name: "Go to slide 2" }))
    await expect(
      canvas.getByRole("button", { name: "Go to slide 2" })
    ).toHaveAttribute("aria-current", "true")
  }
}

export const MobileFlexibleDescriptionSpace: Story = {
  ...FlexibleDescriptionSpace,
  globals: { viewport: { value: "mobile", isRotated: false } }
}

export const PauseAndResume: Story = {
  play: async ({ canvas, canvasElement }) => {
    const firstSlide = await canvas.findByRole("button", {
      name: "Go to slide 1"
    })
    ;(await canvas.findByRole("button", { name: "Pause slideshow" })).focus()
    await userEvent.keyboard("[Space]")
    await userEvent.click(
      canvas.getByRole("heading", { name: "Gold Exhibitors" })
    )
    await expect(
      canvasElement.querySelector(
        '[data-slot="carousel"] > [data-slot="carousel-content"] > div'
      )
    ).toHaveAttribute("aria-live", "polite")
    await new Promise(resolve => setTimeout(resolve, 6500))
    await expect(firstSlide).toHaveAttribute("aria-current", "true")
    await userEvent.click(
      canvas.getByRole("button", { name: "Play slideshow" })
    )
    await expect(
      canvas.getByRole("button", { name: "Pause slideshow" })
    ).toBeEnabled()
    await userEvent.click(
      canvas.getByRole("heading", { name: "Gold Exhibitors" })
    )
    await expect(canvasElement.querySelector("[aria-live]")).toHaveAttribute(
      "aria-live",
      "off"
    )
  }
}

export const ReducedMotion: Story = {
  beforeEach: () => {
    const original = window.matchMedia
    window.matchMedia = query => {
      const media = original.call(window, query)
      if (query === "(prefers-reduced-motion: reduce)") {
        Object.defineProperty(media, "matches", { value: true })
      }
      return media
    }
    return () => {
      window.matchMedia = original
    }
  },
  play: async ({ canvas, canvasElement }) => {
    const firstSlide = await canvas.findByRole("button", {
      name: "Go to slide 1"
    })
    await expect(
      canvas.queryByRole("button", { name: "Pause slideshow" })
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole("button", { name: "Play slideshow" })
    ).not.toBeInTheDocument()
    await expect(canvasElement.querySelector("[aria-live]")).toHaveAttribute(
      "aria-live",
      "polite"
    )
    await new Promise(resolve => setTimeout(resolve, 6500))
    await expect(firstSlide).toHaveAttribute("aria-current", "true")
    await userEvent.click(canvas.getByRole("button", { name: "Go to slide 2" }))
    await expect(
      canvas.getByRole("button", { name: "Go to slide 2" })
    ).toHaveAttribute("aria-current", "true")
  }
}

export const ExpandedCanResumeAutoplay: Story = {
  args: IndependentExpansion.args,
  play: async ({ canvas }) => {
    const firstSlide = await canvas.findByRole("button", {
      name: "Go to slide 1"
    })
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Read more" })[0]
    )
    const play = await canvas.findByRole("button", { name: "Play slideshow" })
    await expect(play).toBeEnabled()
    await userEvent.click(play)
    await userEvent.click(
      canvas.getByRole("heading", { name: "Gold Exhibitors" })
    )
    await expect(
      canvas.getByRole("button", { name: "Pause slideshow" })
    ).toBeEnabled()
    await waitFor(
      () => expect(firstSlide).toHaveAttribute("aria-current", "false"),
      { timeout: 7500 }
    )
    await expect(
      canvas.getByRole("button", { name: "Read less" })
    ).toHaveAttribute("aria-expanded", "true")
  }
}

export const RotationControlPlacement: Story = {
  play: async ({ canvas, canvasElement }) => {
    const control = await canvas.findByRole("button", {
      name: "Pause slideshow"
    })
    const card = canvasElement.querySelector<HTMLElement>('[data-slot="card"]')!
    const cardBounds = card.getBoundingClientRect()
    const buttonBounds = control.getBoundingClientRect()
    await expect(buttonBounds.right).toBeLessThanOrEqual(cardBounds.right)
    await expect(buttonBounds.bottom).toBeLessThanOrEqual(cardBounds.bottom)
    await expect(cardBounds.right - buttonBounds.right).toBeLessThan(16)
    await expect(cardBounds.bottom - buttonBounds.bottom).toBeLessThan(16)
    await expect(getComputedStyle(control).borderTopWidth).toBe("0px")
    await expect(buttonBounds.width).toBeGreaterThanOrEqual(44)
  }
}

export const HoverReflectsPlayback: Story = {
  play: async ({ canvas, canvasElement }) => {
    const carousel = canvas.getByRole("region")
    await userEvent.hover(carousel)
    await expect(
      await canvas.findByRole("button", { name: "Play slideshow" })
    ).toBeEnabled()
    await expect(canvasElement.querySelector("[aria-live]")).toHaveAttribute(
      "aria-live",
      "polite"
    )
    await userEvent.unhover(carousel)
    await expect(
      canvas.getByRole("button", { name: "Pause slideshow" })
    ).toBeEnabled()
    await userEvent.hover(carousel)
    await userEvent.click(
      await canvas.findByRole("button", { name: "Play slideshow" })
    )
    await expect(
      canvas.getByRole("button", { name: "Pause slideshow" })
    ).toBeEnabled()
    await expect(canvasElement.querySelector("[aria-live]")).toHaveAttribute(
      "aria-live",
      "off"
    )
  }
}

export const RandomizedOrder: Story = {
  args: {
    exhibitors: Array.from({ length: 10 }, (_, index) => ({
      ...exhibitors[0],
      id: index + 1,
      name: `Gold exhibitor ${index + 1}`
    }))
  },
  beforeEach: () => {
    const original = Math.random
    Math.random = () => 0
    return () => {
      Math.random = original
    }
  },
  play: async ({ canvas, canvasElement }) => {
    const lastSlide = await canvas.findByRole("button", {
      name: "Go to slide 10"
    })
    const names = () =>
      Array.from(
        canvasElement.querySelectorAll('[data-slot="card"] h3'),
        heading => heading.textContent
      )
    const expected = [
      ...Array.from({ length: 9 }, (_, index) => `Gold exhibitor ${index + 2}`),
      "Gold exhibitor 1"
    ]
    await expect(names()).toEqual(expected)
    await userEvent.click(lastSlide)
    await expect(lastSlide).toHaveAttribute("aria-current", "true")
    await expect(names()).toEqual(expected)
  }
}

export const TouchSwipePausesAutoplay: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas, canvasElement }) => {
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]'
    )!
    await canvas.findByRole("button", { name: "Pause slideshow" })
    const rect = viewport.getBoundingClientRect()
    const point = (x: number) =>
      new Touch({
        identifier: 1,
        target: viewport,
        clientX: x,
        clientY: rect.top + 30
      })
    const start = point(rect.right - 20)
    const end = point(rect.left + 20)
    fireEvent.touchStart(viewport, {
      touches: [start],
      targetTouches: [start],
      changedTouches: [start]
    })
    fireEvent.touchMove(viewport, {
      touches: [end],
      targetTouches: [end],
      changedTouches: [end]
    })
    fireEvent.touchEnd(viewport, {
      touches: [],
      targetTouches: [],
      changedTouches: [end]
    })
    await expect(
      canvas.getByRole("button", { name: "Play slideshow" })
    ).toBeEnabled()
    const secondSlide = canvas.getByRole("button", { name: "Go to slide 2" })
    await waitFor(
      () => expect(secondSlide).toHaveAttribute("aria-current", "true"),
      { timeout: 2000 }
    )
    await new Promise(resolve => setTimeout(resolve, 6500))
    await expect(secondSlide).toHaveAttribute("aria-current", "true")
  }
}

export const VerticalScrollKeepsAutoplay: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas, canvasElement }) => {
    await canvas.findByRole("button", { name: "Pause slideshow" })
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]'
    )!
    const rect = viewport.getBoundingClientRect()
    const point = (x: number, y: number) =>
      new Touch({ identifier: 1, target: viewport, clientX: x, clientY: y })
    const start = point(rect.left + 40, rect.top + 30)
    const jitter = point(start.clientX + 3, start.clientY + 3)
    const end = point(start.clientX + 5, start.clientY + 150)
    fireEvent.touchStart(viewport, {
      touches: [start],
      targetTouches: [start],
      changedTouches: [start]
    })
    fireEvent.touchMove(viewport, {
      touches: [jitter],
      targetTouches: [jitter],
      changedTouches: [jitter]
    })
    const move = new TouchEvent("touchmove", {
      bubbles: true,
      cancelable: true,
      touches: [end],
      targetTouches: [end],
      changedTouches: [end]
    })
    fireEvent(viewport, move)
    fireEvent.touchEnd(viewport, {
      touches: [],
      targetTouches: [],
      changedTouches: [end]
    })
    await expect(move.defaultPrevented).toBe(false)
    await expect(
      canvas.getByRole("button", { name: "Pause slideshow" })
    ).toBeEnabled()
    await expect(canvasElement.querySelector("[aria-live]")).toHaveAttribute(
      "aria-live",
      "off"
    )
    await waitFor(
      () =>
        expect(
          canvas.getByRole("button", { name: "Go to slide 2" })
        ).toHaveAttribute("aria-current", "true"),
      { timeout: 7500 }
    )
  }
}
