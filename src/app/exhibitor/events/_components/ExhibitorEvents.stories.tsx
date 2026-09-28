import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { ExhibitorEvents } from "./ExhibitorEvents"

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
        description: "Own the room."
      },
      {
        title: "Panel Discussion",
        image: "panel-discussion",
        description: "Position your company"
      },
      {
        title: "Field Visit",
        image: "field-visit",
        description: "Bring students into your world."
      },
      {
        title: "After Work",
        image: "after-work",
        description: "Keep the conversation going"
      },
      {
        title: "Collaborative Events",
        image: "custom",
        description: "Have something more specific in mind?"
      }
    ]

    for (const event of events) {
      const trigger = canvas.getByRole("button", {
        name: `View ${event.title} details`
      })
      const photo = within(trigger).getByRole("img")
      await expect(photo).toBeVisible()
      await expect(photo.getAttribute("alt")?.trim().length).toBeGreaterThan(0)
      await expect(photo.getAttribute("src")).toContain(
        `/events/${event.image}.webp`
      )
      await expect(body.queryByRole("dialog")).not.toBeInTheDocument()
      for (const detail of within(trigger).queryAllByText(
        /^(Price|Location):/
      )) {
        await expect(detail.tagName).toBe("STRONG")
      }

      // Cards are keyboard-operable, and focus returns after dismissing details.
      trigger.focus()
      await user.keyboard("{Enter}")
      const dialog = await body.findByRole("dialog", { name: event.title })
      await expect(dialog.hasAttribute("data-vaul-drawer")).toBe(
        canvasElement.ownerDocument.defaultView!.innerWidth <= 768
      )
      for (const detail of within(dialog).queryAllByText(
        /^(Price|Location):/
      )) {
        await expect(detail.tagName).toBe("STRONG")
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
      await waitFor(() =>
        expect(body.queryByRole("dialog")).not.toBeInTheDocument()
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
    await user.click(
      canvas.getByRole("button", { name: "View Lunch Lecture details" })
    )
    const dialog = await within(canvasElement.ownerDocument.body).findByRole(
      "dialog",
      { name: "Lunch Lecture" }
    )
    await waitFor(() => {
      expect(within(dialog).getByText("60 attendees: 24,700 SEK")).toBeVisible()
      expect(
        within(dialog).getByText("100 attendees: 31,900 SEK")
      ).toBeVisible()
    })
  }
}

export const MobileCollaborativeDetails: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvas, canvasElement }) => {
    const user = userEvent.setup({ document: canvasElement.ownerDocument })
    await user.click(
      canvas.getByRole("button", { name: "View Collaborative Events details" })
    )
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
