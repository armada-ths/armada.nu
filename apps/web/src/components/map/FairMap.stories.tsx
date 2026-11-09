import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test"
import FairMap from "./FairMap"
import { MAPS, mapExhibitors, PLACEMENTS } from "./maps"

const placements = mapExhibitors(
  PLACEMENTS.filter(
    ({ booth, name }) =>
      booth === 62 || booth === 72 || name === "Adven Group Oy"
  ).map(({ exhibitorId, name, day }) => ({
    id: exhibitorId,
    name: name === "Epiroc" ? "Epiroc AB" : name,
    type: "company",
    climateCompensation: false,
    tier: day === 17 ? "Gold" : day === 18 ? "Silver" : "Bronze",
    ...(day === 17 && { logoThumbnail: "/armada_licorice.svg" }),
    ...(day === 18 && {
      logoThumbnail: "/missing-fair-map-test-logo.svg",
      logoFreesize: "/LogoDCS-300dpi.png"
    })
  }))
)

const meta = {
  title: "Student/FairMap",
  component: FairMap,
  tags: ["autodocs"],
  args: {
    floor: MAPS[0],
    placements: placements.filter(p => p.floor === 2),
    focus: null
  }
} satisfies Meta<typeof FairMap>

export default meta
type Story = StoryObj<typeof meta>

export const SharedBooth: Story = {
  play: async ({ canvas }) => {
    const booth = canvas.getByRole("button", { name: /booth 62,/i })
    await waitFor(() =>
      expect(
        Array.from(booth.querySelectorAll("image"), image =>
          image.getAttribute("href")
        )
      ).toEqual(["/armada_licorice.svg", "/LogoDCS-300dpi.png"])
    )
    await expect(booth.querySelector(".fill-pineapple")).toBeInTheDocument()
    await expect(booth.querySelector(".fill-silver")).toBeInTheDocument()
    await userEvent.click(booth)
    const dialog = await within(document.body).findByRole("dialog")
    await waitFor(() =>
      expect(within(dialog).getByText("17 November")).toBeVisible()
    )
    await expect(within(dialog).getByText("18 November")).toBeVisible()
    await expect(
      within(dialog).getByRole("link", { name: "Handelsbanken" })
    ).toHaveAttribute("href", expect.stringContaining("?id="))
    await expect(
      within(dialog).getByRole("link", { name: /SKC/ })
    ).toHaveAttribute("href", expect.stringContaining("?id="))
  }
}

export const SwedishKeyboardAndNoLogo: Story = {
  globals: { locale: "sv" },
  play: async ({ canvas }) => {
    const booth = canvas.getByRole("button", { name: "Monter 72, Epiroc AB" })
    await expect(within(booth).getByText("EPI")).toBeVisible()
    booth.focus()
    await userEvent.keyboard("{Enter}")
    const dialog = await within(document.body).findByRole("dialog")
    await waitFor(() =>
      expect(within(dialog).getByText("Epiroc AB")).toBeVisible()
    )
    await expect(within(dialog).queryByRole("img")).not.toBeInTheDocument()
    await expect(
      within(dialog).queryByRole("link", { name: "Visa på karta" })
    ).not.toBeInTheDocument()
    await expect(dialog).toHaveClass("min-w-[80vw]", "bg-bronze")
  }
}

export const WheelZoom: Story = {
  play: async ({ canvas }) => {
    const map = canvas.getByLabelText("Nymble floor 2")
    const content = map.parentElement
    if (!content) throw new Error("Map transform content is missing")

    const { x, y, width, height } = map.getBoundingClientRect()
    const wheel = (ctrlKey = false) =>
      fireEvent.wheel(map, {
        ctrlKey,
        deltaY: -100,
        clientX: x + width / 2,
        clientY: y + height / 2
      })
    const scale = () => new DOMMatrix(getComputedStyle(content).transform).a

    wheel()
    await waitFor(() => expect(scale()).toBeCloseTo(1.25, 2))
    wheel(true)
    await waitFor(() => expect(scale()).toBeCloseTo(1.8125, 2))

    fireEvent.keyDown(window, { key: "Control", ctrlKey: true })
    try {
      wheel(true)
      await waitFor(() => expect(scale()).toBeCloseTo(2.0625, 2))
    } finally {
      fireEvent.keyUp(window, { key: "Control", ctrlKey: false })
    }
  }
}

export const FinnishCompanySuffix: Story = {
  args: { floor: MAPS[1], placements: placements.filter(p => p.floor === 3) },
  play: async ({ canvas }) => {
    const adven = canvas.getByRole("button", { name: /Adven Group Oy/ })
    await expect(within(adven).getByText("AG")).toBeVisible()
  }
}
