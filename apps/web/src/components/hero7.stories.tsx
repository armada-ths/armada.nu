import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Hero1 } from "./hero7"

const meta = {
  title: "Homepage/Hero",
  component: Hero1,
  tags: ["autodocs"],
  args: {
    heading: "Set Sail For Success",
    description: "The No. 1 career fair at KTH Royal Institute of Technology"
  }
} satisfies Meta<typeof Hero1>

export default meta
type Story = StoryObj<typeof meta>

export const WithTracking: Story = {
  args: {
    buttons: {
      primary: {
        text: "Browse our events",
        url: "/student/events",
        tracking: {
          eventName: "student_events_click",
          eventData: { location: "hero_primary" }
        }
      },
      secondary: {
        text: "Read our blog",
        url: "/blog",
        tracking: {
          eventName: "blog_click",
          eventData: { location: "hero_secondary" }
        }
      }
    }
  }
}

export const WithoutTracking: Story = {
  args: {
    buttons: {
      primary: { text: "Join Armada", url: "/student/recruitment" },
      secondary: { text: "Meet the Team", url: "/about/team" }
    }
  }
}
