import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { DateTime } from "luxon"
import { expect } from "storybook/test"

import { COMING_SOON_TEXT } from "./ComingSoonPage"
import { NavigationMenuClient } from "./NavigationMenuClient"

const currentYear = DateTime.now().year

const meta = {
  title: "Shared/NavigationMenu",
  component: NavigationMenuClient,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  args: {
    signupUrl: "https://app.eventro.se/register/armada",
    exhibitorPackagesEnabled: true,
    exhibitorEventsEnabled: true,
    eventsEnabled: true,
    mapEnabled: true,
    atFairEnabled: true,
    exhibitorPageEnabled: true,
    studentRecruitmentEnabled: true,
    exhibitorMainEnabled: true,
    exhibitorTimelineEnabled: true,
    exhibitorSignupEnabled: true,
    aboutPageEnabled: true,
    aboutTeamEnabled: true,
    blogEnabled: true
  },
  render: args => (
    <div className="bg-coconut min-h-112 pb-10">
      <NavigationMenuClient {...args} />
      <div className="mx-auto max-w-5xl px-6 pt-28">
        <h1 className="font-bebas-neue text-melon text-5xl">
          Storybook navigation preview
        </h1>
        <p className="mt-4 max-w-2xl">
          This filler content keeps the fixed header in a realistic layout while
          you inspect desktop navigation states.
        </p>
      </div>
    </div>
  )
} satisfies Meta<typeof NavigationMenuClient>

export default meta
type Story = StoryObj<typeof meta>

export const AllSectionsEnabled: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", {
      name: "For Students"
    })

    await userEvent.click(trigger)

    await expect(
      canvas.getByText("Look at the companies attending the fair")
    ).toBeInTheDocument()
    await expect(
      canvas.getByText(
        `Join Armada ${currentYear}. See which roles are available`
      )
    ).toBeInTheDocument()

    await userEvent.click(trigger)
  }
}

export const WithComingSoonItem: Story = {
  args: {
    mapEnabled: false
  },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", {
      name: "For Students"
    })

    await userEvent.click(trigger)

    await expect(canvas.getByText(COMING_SOON_TEXT)).toBeInTheDocument()

    await userEvent.click(trigger)
  }
}
