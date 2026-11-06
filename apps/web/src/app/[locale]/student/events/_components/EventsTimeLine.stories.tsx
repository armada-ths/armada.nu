import { env } from "@/env"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { track } from "@vercel/analytics"
import { expect, userEvent, waitFor, within } from "storybook/test"

import type { Event } from "@/components/shared/hooks/api/useEvents"

import { EventsTimeline } from "./EventsTimeLine"

const eventDefaults: Event = {
  id: 1,
  name: "Women in Tech Evening",
  description:
    "<p>Meet inspiring engineers and discover new paths into the technology industry.</p>",
  location: "Nymble, KTH Campus",
  food: "Dinner included",
  openTo: "All KTH students",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=59.34736,18.07073",
  eventStart: "2026-10-08T17:30:00+02:00",
  eventEnd: "2026-10-08T20:00:00+02:00",
  registrationEnd: "2026-10-05T23:59:00+02:00",
  imageUrl: "/fair_pictures/53396623064_9fce4e05b3_c.jpg",
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
  beforeEach: () => {
    const previous = env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
    env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY = "storybook-maps-key"
    return () => {
      env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY = previous
    }
  },
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

    await expect(eventLink).toHaveAttribute("href", "/en/student/events?id=1")
    await userEvent.click(eventLink)

    const dialog = await within(document.body).findByRole("dialog")
    await expect(
      within(dialog).getByRole("heading", {
        name: "Women in Tech Evening",
        level: 1
      })
    ).toBeInTheDocument()

    await expect(
      within(dialog).getByText("All KTH students")
    ).toBeInTheDocument()
    await expect(within(dialog).queryByText("Capacity")).not.toBeInTheDocument()
    await expect(
      within(dialog).queryByText("80 participants")
    ).not.toBeInTheDocument()
    await expect(
      within(dialog).getByTitle("Map for Women in Tech Evening")
    ).toHaveAttribute("src", expect.stringContaining("/maps/embed/v1/place?"))
    await expect(
      within(dialog).getByRole("link", { name: "Open map" })
    ).toHaveAttribute("href", eventDefaults.mapUrl)

    await userEvent.click(within(dialog).getByRole("link", { name: "Sign up" }))
    await expect(track).toHaveBeenCalledWith("student_event_signup_click", {
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

export const UntrustedDescription: Story = {
  args: {
    events: [
      {
        ...eventDefaults,
        description: `
          <p onclick="window.__eventDescriptionXss = true">Safe <strong>formatting</strong></p>
          <img src="x" onerror="window.__eventDescriptionXss = true">
          <script>window.__eventDescriptionXss = true</script>
          <svg onload="window.__eventDescriptionXss = true"></svg>
          <iframe src="https://example.com"></iframe>
          <a href="javascript:window.__eventDescriptionXss = true">Bad link</a>
          <a href="https://example.com/info" title="Event information">Official information</a>
        `
      }
    ]
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole("link", { name: /Women in Tech Evening/i })
    )

    const dialog = await within(document.body).findByRole("dialog")
    const description = dialog.querySelector("[data-event-description]")
    if (!description) throw new Error("Event description was not rendered")
    await expect(within(dialog).getByText("formatting")).toBeInTheDocument()
    await expect(
      within(dialog).getByRole("link", { name: "Official information" })
    ).toHaveAttribute("href", "https://example.com/info")
    await expect(within(dialog).getByText("Bad link")).not.toHaveAttribute(
      "href"
    )
    await expect(
      description.querySelector("img, script, svg, iframe")
    ).toBeNull()
    await expect(
      description.querySelector("[onclick], [onerror], [onload]")
    ).toBeNull()
  }
}

export const WithoutOptionalDetails: Story = {
  args: {
    events: [
      {
        ...eventDefaults,
        location: undefined,
        food: null,
        openTo: undefined,
        mapUrl: null
      }
    ]
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole("link", { name: /Women in Tech Evening/i })
    )
    const dialog = within(await within(document.body).findByRole("dialog"))
    await expect(dialog.queryByText("Location")).not.toBeInTheDocument()
    await expect(dialog.queryByText("Food")).not.toBeInTheDocument()
    await expect(dialog.queryByText("Open to")).not.toBeInTheDocument()
    await expect(
      dialog.queryByRole("link", { name: "Open map" })
    ).not.toBeInTheDocument()
  }
}

export const MobileMap: Story = {
  args: { events: [eventDefaults] },
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole("link", { name: /Women in Tech Evening/i })
    )
    const dialog = within(await within(document.body).findByRole("dialog"))
    for (const name of ["Open map", "Sign up"]) {
      const link = dialog.getByRole("link", { name })
      link.scrollIntoView({ block: "center", behavior: "instant" })
      await waitFor(async () => {
        const bounds = link.getBoundingClientRect()
        await expect(bounds.top).toBeGreaterThanOrEqual(0)
        await expect(bounds.bottom).toBeLessThanOrEqual(window.innerHeight)
      })
    }
  }
}

export const CmsRegistrationDeadline: Story = {
  args: {
    events: [{ ...eventDefaults, openForSignupStudent: undefined }]
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Registration closes 5 October")
    ).toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole("link", { name: /Women in Tech Evening/i })
    )
    const dialog = within(await within(document.body).findByRole("dialog"))
    await expect(
      dialog.getByText("Registration closes 5 October")
    ).toBeInTheDocument()
    await expect(dialog.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      eventDefaults.signupLink
    )
  }
}

export const WithoutRegistrationDeadline: Story = {
  args: {
    events: [{ ...eventDefaults, registrationEnd: undefined }]
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByText(/Registration closes/)
    ).not.toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole("link", { name: /Women in Tech Evening/i })
    )
    const dialog = within(await within(document.body).findByRole("dialog"))
    await expect(
      dialog.queryByText(/Registration closes/)
    ).not.toBeInTheDocument()
    await expect(
      dialog.getByRole("link", { name: "Sign up" })
    ).toBeInTheDocument()
  }
}
