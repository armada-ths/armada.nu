import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import FairMap from "./FairMap"
import { MAPS, mapExhibitors, PLACEMENTS } from "./maps"

const placements = mapExhibitors(
  PLACEMENTS.filter(({ booth }) => booth === 62 || booth === 72).map(
    ({ exhibitorId, name }) => ({
      id: exhibitorId,
      name,
      type: "company",
      climateCompensation: false
    })
  )
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
    await userEvent.click(canvas.getByRole("button", { name: /booth 62,/i }))
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
    const booth = canvas.getByRole("button", { name: "Monter 72, Epiroc" })
    booth.focus()
    await userEvent.keyboard("{Enter}")
    const dialog = await within(document.body).findByRole("dialog")
    await waitFor(() =>
      expect(within(dialog).getByText("Epiroc")).toBeVisible()
    )
    await expect(within(dialog).queryByRole("img")).not.toBeInTheDocument()
  }
}
