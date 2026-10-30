import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import type { SVGProps } from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import FairMap from "./FairMap"

function ExampleMap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 400 300">
      <rect id="example__booth1" x="140" y="100" width="120" height="80" />
    </svg>
  )
}

const meta = {
  title: "Student/FairMap",
  component: FairMap,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    currentFloorIndex: 0,
    MapComponent: ExampleMap,
    exhibitors: [
      {
        id: 1,
        name: "Mapped Company",
        type: "company",
        fairLocation: "booth1",
        climateCompensation: false,
        logoThumbnail: "/armada_licorice.svg",
        logoFreesize: "/unused-original.png",
        cities: "Stockholm"
      }
    ]
  }
} satisfies Meta<typeof FairMap>
export default meta
type Story = StoryObj<typeof meta>

export const ThumbnailAndCompanyDetails: Story = {
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const logo = canvasElement.querySelector("image[data-logo]")
      expect(logo?.getAttributeNS("http://www.w3.org/1999/xlink", "href")).toBe(
        "/armada_licorice.svg"
      )
    })
    await waitFor(() =>
      expect(
        within(canvasElement).queryByText("Loading the map...")
      ).not.toBeInTheDocument()
    )
    const booth = canvasElement.querySelector<SVGElement>("#example__booth1")!
    await userEvent.click(booth)
    const dialog = await within(document.body).findByRole("dialog")
    await expect(await within(dialog).findByText("Stockholm")).toBeVisible()
  }
}
