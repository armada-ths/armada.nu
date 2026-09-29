import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { ExhibitorEvents } from "./ExhibitorEvents"

async function findEnabledEventTrigger(
  canvas: ReturnType<typeof within>,
  title: string
) {
  return waitFor(async () => {
    // Hydration replaces the initial disabled card with a drawer/dialog trigger.
    const trigger = canvas.getByRole("button", {
      name: `View ${title} details`
    })
    await expect(trigger).toBeEnabled()
    return trigger
  })
}

const meta = {
  title: "Exhibitor/Events",
  component: ExhibitorEvents,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  play: async ({ canvas, canvasElement }) => {
    const user = userEvent.setup({ document: canvasElement.ownerDocument })
    const body = within(canvasElement.ownerDocument.body)
    await expect(
      canvas.getByRole("heading", { name: "Exhibitor Events" })
    ).toBeVisible()

    const events = [
      {
        title: "Lunch Lecture",
        image: "lunch-lecture",
        summary: ["Price: 24,700 / 31,900 SEK excl. VAT"],
        description: "Own the room."
      },
      {
        title: "Panel Discussion",
        image: "panel-discussion",
        summary: ["Price: 9,300 SEK excl. VAT"],
        description: "Position your company"
      },
      {
        title: "Field Visit",
        image: "field-visit",
        summary: [
          "Location: Your office",
          "Price: 9,300 SEK / 30 attendees excl. VAT"
        ],
        description: "Bring students into your world."
      },
      {
        title: "After Work",
        image: "after-work",
        summary: [
          "Location: Your office or Nymble",
          "Price: 9,300 / 12,400 SEK excl. VAT"
        ],
        description: "Keep the conversation going"
      },
      {
        title: "Collaborative Events",
        image: "custom",
        summary: ["Your concept, your way"],
        description: "Have something more specific in mind?"
      }
    ]

    for (const event of events) {
      const trigger = await findEnabledEventTrigger(canvas, event.title)
      const photo = within(trigger).getByRole("img")
      await expect(trigger).toHaveAccessibleDescription(event.summary.join(" "))
      await expect(photo).toBeVisible()
      await expect(photo.getAttribute("alt")?.trim().length).toBeGreaterThan(0)
      await expect(photo.getAttribute("src")).toContain(
        `/events/${event.image}.webp`
      )
      await expect(
        body.queryByRole("dialog", { name: event.title })
      ).not.toBeInTheDocument()
      const importantDetails = event.summary.filter(detail =>
        /^(Price|Location):/.test(detail)
      )
      for (const detail of importantDetails) {
        await expect(
          within(trigger).getByText(detail, { selector: "strong" })
        ).toBeVisible()
      }

      // Cards are keyboard-operable, and focus returns after dismissing details.
      trigger.focus()
      await user.keyboard("{Enter}")
      const dialog = await body.findByRole("dialog", { name: event.title })
      await expect(dialog.hasAttribute("data-vaul-drawer")).toBe(
        canvasElement.ownerDocument.defaultView!.innerWidth <= 768
      )
      for (const detail of importantDetails) {
        await expect(
          within(dialog).getByText(detail, { selector: "strong" })
        ).toBeInTheDocument()
      }
      await waitFor(() =>
        expect(
          within(dialog).getByText(text => text.startsWith(event.description))
        ).toBeVisible()
      )
      if (event.image === "custom") {
        await expect(
          within(dialog).getByRole("link", { name: "event@armada.nu" })
        ).toHaveAttribute("href", "mailto:event@armada.nu")
        await expect(dialog.querySelector("video")).toHaveAttribute("controls")
        await user.click(within(dialog).getByRole("button", { name: "Close" }))
      } else {
        await user.keyboard("{Escape}")
      }
      // Radix keeps the closed dialog mounted until its exit animation ends.
      await waitFor(() =>
        expect(dialog).toHaveAttribute("data-state", "closed")
      )
      await waitFor(() => expect(trigger).toHaveFocus())
    }
    canvasElement.ownerDocument.defaultView?.scrollTo(0, 0)
  }
} satisfies Meta<typeof ExhibitorEvents>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } }
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } }
}

export const Tablet: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } }
}

export const LunchLectureDetails: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } },
  play: async ({ canvas, canvasElement }) => {
    const user = userEvent.setup({ document: canvasElement.ownerDocument })
    const trigger = await findEnabledEventTrigger(canvas, "Lunch Lecture")
    await user.click(trigger)
    const dialog = await within(canvasElement.ownerDocument.body).findByRole(
      "dialog",
      { name: "Lunch Lecture" }
    )
    await waitFor(() => {
      expect(
        within(dialog).getByText("60 attendees: 24,700 SEK", {
          selector: "strong"
        })
      ).toBeVisible()
      expect(
        within(dialog).getByText("100 attendees: 31,900 SEK", {
          selector: "strong"
        })
      ).toBeVisible()
    })
  }
}

export const MobileCollaborativeDetails: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas, canvasElement }) => {
    const user = userEvent.setup({ document: canvasElement.ownerDocument })
    const trigger = await findEnabledEventTrigger(
      canvas,
      "Collaborative Events"
    )
    await user.click(trigger)
    const dialog = await within(canvasElement.ownerDocument.body).findByRole(
      "dialog",
      { name: "Collaborative Events" }
    )
    await expect(
      within(dialog).getByRole("link", { name: "event@armada.nu" })
    ).toHaveAttribute("href", "mailto:event@armada.nu")
    await expect(dialog.querySelector("video")).toHaveAttribute("controls")
  }
}

export const MobileLunchLectureDetails: Story = {
  ...LunchLectureDetails,
  globals: { viewport: { value: "mobile", isRotated: false } }
}
