import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import InteractiveMapClient from "./InteractiveMapClient"
import { PLACEMENTS } from "./maps"

const meta = {
  title: "Student/InteractiveMap",
  component: InteractiveMapClient,
  tags: ["autodocs"],
  args: { title: "Fair Map", exhibitors: [] }
} satisfies Meta<typeof InteractiveMapClient>

export default meta
type Story = StoryObj<typeof meta>

export const SearchAcrossFloors: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas, canvasElement }) => {
    const { href } = window.location
    const state = window.history.state
    try {
      for (const [name, floor, booth] of [
        ["Coherent", 3, 102],
        ["Epiroc", 2, 72]
      ] as const) {
        await userEvent.click(
          canvas.getByRole("button", { name: "Find an exhibitor" })
        )
        await expect(
          canvas.getByRole("button", { name: "Find an exhibitor" })
        ).toHaveClass("transition-none")
        const body = within(document.body)
        const input = await body.findByRole("combobox")
        await userEvent.type(input, name)
        await userEvent.click(
          await body.findByRole("option", { name: new RegExp(name) })
        )
        await expect(
          canvas.getByRole("button", { name: `Nymble floor ${floor}` })
        ).toHaveAttribute("aria-pressed", "true")
        await waitFor(() =>
          expect(body.queryByRole("combobox")).not.toBeInTheDocument()
        )
        await expect(
          canvas.getByRole("button", { name: new RegExp(name) })
        ).toHaveAttribute("data-selected", "true")
        await expect(
          canvasElement.querySelector("[data-map-label]")
        ).toHaveTextContent(name)
        const id = PLACEMENTS.find(
          placement => placement.name === name
        )?.exhibitorId
        await expect(
          new URLSearchParams(window.location.search).get("id")
        ).toBe(String(id))
        await expect(canvas.getByRole("status")).toHaveTextContent(
          `${name} · Floor ${floor} · Booth ${booth}`
        )
      }
      await userEvent.click(
        canvas.getByRole("button", { name: "Nymble floor 3" })
      )
      await expect(new URLSearchParams(window.location.search).has("id")).toBe(
        false
      )
      await expect(
        canvasElement.querySelector("[data-map-label]")
      ).not.toBeInTheDocument()
    } finally {
      window.history.replaceState(state, "", href)
    }
  }
}

export const LinkedExhibitor: Story = {
  args: {
    initialExhibitorId: String(
      PLACEMENTS.find(placement => placement.name === "Coherent")?.exhibitorId
    )
  },
  play: async ({ args, canvas, canvasElement }) => {
    await expect(
      canvas.getByRole("button", { name: "Nymble floor 3" })
    ).toHaveAttribute("aria-pressed", "true")
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Coherent · Floor 3 · Booth 102"
    )
    const label = canvasElement.querySelector("[data-map-label]")
    await expect(label).toHaveStyle({ pointerEvents: "auto" })

    const { href } = window.location
    const state = window.history.state
    const url = new URL(href)
    url.searchParams.set("id", args.initialExhibitorId ?? "")
    window.history.replaceState(state, "", url)
    try {
      canvas.getByRole("button", { name: /Booth 101, Orica/ }).focus()
      await userEvent.keyboard("{Enter}")
      const dialog = await within(document.body).findByRole("dialog")
      await expect(within(dialog).getByText("Orica Sweden AB")).toBeVisible()
      await expect(label).not.toBeInTheDocument()
      await expect(new URLSearchParams(window.location.search).has("id")).toBe(
        false
      )
    } finally {
      window.history.replaceState(state, "", href)
    }
  }
}

export const DefaultTierOrder: Story = {
  args: {
    exhibitors: PLACEMENTS.slice(0, 4).map(({ exhibitorId, name }, index) => ({
      id: exhibitorId,
      name,
      type: "company",
      climateCompensation: false,
      tier: [undefined, "Bronze", "Silver", "Gold"][index]
    }))
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Find an exhibitor" })
    )
    const body = within(document.body)
    const input = await body.findByRole("combobox")
    const list = body.getByRole("listbox")
    await expect(within(list).queryByText("Exhibitors")).not.toBeInTheDocument()
    const expected = args.exhibitors
      .toReversed()
      .map(exhibitor => exhibitor.name)
    const expectTierOrder = () => {
      const options = body.getAllByRole("option")
      expect(
        options.slice(0, 4).map(option => option.firstElementChild?.textContent)
      ).toEqual(expected)
    }

    await waitFor(expectTierOrder)
    await userEvent.type(input, "MSAB")
    await expect(
      await body.findByRole("option", { name: /MSAB/ })
    ).toBeVisible()
    await expect(
      body.queryByRole("option", { name: /GKN Aerospace/ })
    ).not.toBeInTheDocument()
    await userEvent.clear(input)
    await waitFor(expectTierOrder)
  }
}
