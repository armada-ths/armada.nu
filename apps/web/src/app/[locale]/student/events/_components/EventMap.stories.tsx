import { env } from "@/env"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { EventMap } from "./EventMap"

const meta = {
  beforeEach: () => {
    const previous = env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
    env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY = "storybook-maps-key"
    return () => {
      env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY = previous
    }
  },
  title: "Student/EventMap",
  component: EventMap,
  tags: ["autodocs"],
  args: { name: "Lunch at Nymble" },
  decorators: [
    Story => (
      <div className="bg-snow w-80 p-5">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof EventMap>
export default meta
type Story = StoryObj<typeof meta>

export const GoogleMaps: Story = {
  args: {
    mapUrl: "https://www.google.com/maps/search/?api=1&query=59.34736,18.07073"
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTitle("Map for Lunch at Nymble")).toHaveAttribute(
      "src",
      expect.stringContaining("/maps/embed/v1/place?")
    )
    await expect(canvas.getByTitle("Map for Lunch at Nymble")).toHaveAttribute(
      "referrerpolicy",
      "strict-origin-when-cross-origin"
    )
    await expect(
      canvas.getByRole("link", { name: "Open map" })
    ).toHaveAttribute("target", "_blank")
  }
}
export const LinkOnly: Story = {
  args: { mapUrl: "https://example.com/venue-map" },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByTitle("Map for Lunch at Nymble")
    ).not.toBeInTheDocument()
    await expect(
      canvas.getByRole("link", { name: "Open map" })
    ).toBeInTheDocument()
  }
}
export const Missing: Story = {
  args: { mapUrl: null },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("link")).not.toBeInTheDocument()
    await expect(
      canvas.queryByTitle("Map for Lunch at Nymble")
    ).not.toBeInTheDocument()
  }
}

export const MissingApiKey: Story = {
  args: { mapUrl: "https://www.google.com/maps?q=Nymble" },
  beforeEach: () => {
    const previous = env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
    env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY = ""
    return () => {
      env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY = previous
    }
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByTitle("Map for Lunch at Nymble")
    ).not.toBeInTheDocument()
    await expect(
      canvas.getByRole("link", { name: "Open map" })
    ).toBeInTheDocument()
  }
}
