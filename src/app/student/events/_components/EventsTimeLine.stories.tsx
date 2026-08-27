import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { track } from "@vercel/analytics"
import { expect, userEvent, within } from "storybook/test"

import type { Event } from "@/components/shared/hooks/api/useEvents"

import { EventsTimeline } from "./EventsTimeLine"

const eventDefaults: Event = {
  id: 1,
  name: "Women in Tech Evening",
  description:
    "<p>Meet inspiring engineers and discover new paths into the technology industry.</p>",
  location: "Nymble, KTH Campus",
  food: "Dinner included",
  eventStart: "2026-10-08T17:30:00+02:00",
  eventEnd: "2026-10-08T20:00:00+02:00",
  registrationEnd: "2026-10-05T23:59:00+02:00",
  imageUrl: "/fair_pictures/2.jpeg",
  fee: "Free",
  registrationRequired: true,
  externalEventLink: "",
  signupQuestions: [],
  signupLink: "https://example.com/signup",
  canCreateTeams: false,
  canJoinTeams: false,
  openForSignupStudent: true,
  openForSignupCompany: false,
  eventMaxCapacity: 80,
  participantCount: 31
}

const events: Event[] = [
  eventDefaults,
  {
    ...eventDefaults,
    id: 2,
    name: "Consulting Breakfast",
    location: "KTH Entré",
    eventStart: "2026-10-15T08:00:00+02:00",
    eventEnd: "2026-10-15T10:00:00+02:00",
    registrationEnd: "2026-10-12T23:59:00+02:00",
    imageUrl: ""
  },
  {
    ...eventDefaults,
    id: 3,
    name: "Armada Banquet",
    location: "Stockholm City Hall",
    eventStart: "2026-11-18T18:00:00+01:00",
    eventEnd: "2026-11-18T23:00:00+01:00",
    registrationEnd: undefined,
    imageUrl: "",
    registrationRequired: false,
    signupLink: ""
  }
]

const meta = {
  title: "Student/EventsTimeline",
  component: EventsTimeline,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true
    }
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="bg-coconut min-h-screen px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <Story />
        </div>
      </div>
    )
  ]
} satisfies Meta<typeof EventsTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { events },
  play: async ({ canvas }) => {
    const eventLink = canvas.getByRole("link", {
      name: /Women in Tech Evening/i
    })

    await expect(eventLink).toHaveAttribute("href", "/student/events?id=1")
    await userEvent.click(eventLink)

    const dialog = await within(document.body).findByRole("dialog")
    await expect(
      within(dialog).getByRole("heading", {
        name: "Women in Tech Evening",
        level: 1
      })
    ).toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole("link", { name: "Sign up" }))
    await expect(track).toHaveBeenCalledWith("student_event_click", {
      event_name: "Women in Tech Evening"
    })
  }
}

export const SingleEvent: Story = {
  args: { events: [events[1]] },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Consulting Breakfast" })
    ).toBeInTheDocument()
    await expect(canvas.getByText("KTH Entré")).toBeInTheDocument()
  }
}

export const Mobile: Story = {
  args: { events },
  parameters: {
    viewport: {
      defaultViewport: "mobile"
    }
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(events.length)
    await expect(canvas.getByText("8 October", { selector: "p" })).toBeVisible()
  }
}
