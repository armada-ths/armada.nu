import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import InteractiveMapClient from "./InteractiveMapClient"
import { PLACEMENTS } from "./maps"

const meta = {
  title: "Student/InteractiveMap",
  component: InteractiveMapClient,
  tags: ["autodocs"],
  args: { exhibitors: [] }
} satisfies Meta<typeof InteractiveMapClient>

export default meta
type Story = StoryObj<typeof meta>

export const SearchAcrossFloors: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas }) => {
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
      await expect(canvas.getByRole("status")).toHaveTextContent(
        `${name} · Floor ${floor} · Booth ${booth}`
      )
    }
  }
}

export const LinkedExhibitor: Story = {
  args: {
    initialExhibitorId: String(
      PLACEMENTS.find(placement => placement.name === "Coherent")?.exhibitorId
    )
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Nymble floor 3" })
    ).toHaveAttribute("aria-pressed", "true")
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Coherent · Floor 3 · Booth 102"
    )
  }
}
