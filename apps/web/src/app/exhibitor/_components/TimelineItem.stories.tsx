import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"

import { P } from "@/app/_components/Paragraph"

import { TimelineItem, TimelineList } from "./TimelineItem"

const meta = {
  title: "Exhibitor/TimelineItem",
  component: TimelineItem,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: {
    dateStringISO: "2026-04-10",
    title: "Priority Registration starts"
  }
} satisfies Meta<typeof TimelineItem>

export default meta
type Story = StoryObj<typeof meta>

export const ConnectedTimeline: Story = {
  render: () => (
    <div className="w-[min(34rem,90vw)]">
      <TimelineList defaultValue="Priority Registration starts">
        <TimelineItem
          dateStringISO="2026-04-10"
          dateStringHuman="Before April"
          title="Armada is setting up">
          <P>
            Armada prepares the project, opens early interest, and gets ready
            for the exhibitor year.
          </P>
        </TimelineItem>

        <TimelineItem
          dateStringISO="2026-04-10"
          dateStringHuman="Apr 10, 2026"
          title="Priority Registration starts">
          <P>
            Exhibitors can apply for a place at Armada and contact the sales
            team with questions.
          </P>
        </TimelineItem>

        <TimelineItem
          dateStringISO="2026-05-10"
          dateStringHuman="May 10, 2026"
          title="Priority Registration ends"
        />
      </TimelineList>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", {
        name: /Priority Registration starts/i
      })
    ).toHaveAttribute("data-state", "open")
    await expect(canvas.getByText(/Exhibitors can apply/i)).toBeInTheDocument()
  }
}

export const Collapsed: Story = {
  render: () => (
    <div className="w-[min(34rem,90vw)]">
      <TimelineList>
        <TimelineItem
          dateStringISO="2026-10-01"
          dateStringHuman="Oct 1, 2026"
          title="Fair preparations start">
          <P>
            The host team coordinates practical details, booth logistics, and
            company material before the fair.
          </P>
        </TimelineItem>
      </TimelineList>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", {
      name: /Fair preparations start/i
    })

    await expect(trigger).toHaveAttribute("data-state", "closed")
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("data-state", "open")
  }
}

export const MilestoneOnly: Story = {
  render: () => (
    <div className="w-[min(34rem,90vw)]">
      <TimelineList>
        <TimelineItem
          dateStringISO="2026-11-18"
          dateStringHuman="Nov 18, 2026"
          title="Armada fair ends"
        />
      </TimelineList>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: /Armada fair ends/i })
    ).toBeDisabled()
  }
}
