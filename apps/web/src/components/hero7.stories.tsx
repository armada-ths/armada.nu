import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { expect } from "storybook/test"
import en from "../i18n/messages/en.json"
import sv from "../i18n/messages/sv.json"
import { Hero1 } from "./hero7"
import { Page } from "./shared/Page"

const meta = {
  title: "Homepage/Hero",
  component: Hero1,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Page.Boundary>
        <Story />
      </Page.Boundary>
    )
  ],
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
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", { name: "Join Armada" })
    ).toHaveAttribute("href", "/en/student/recruitment")
    await expect(
      canvas.getByRole("link", { name: "Meet the Team" })
    ).toHaveAttribute("href", "/en/about/team")
  }
}

export const ExhibitorsWithRecruitment: Story = {
  args: {
    buttons: {
      primary: {
        text: en.Static.exploreExhibitors,
        url: "/student/exhibitors",
        tracking: {
          eventName: "student_exhibitors_click",
          eventData: { location: "hero_primary" }
        }
      },
      secondary: {
        text: "Join Armada",
        url: "/student/recruitment",
        tracking: {
          eventName: "student_signup_click",
          eventData: { location: "hero_secondary" }
        }
      }
    }
  }
}

export const ExhibitorsSwedish: Story = {
  globals: { locale: "sv" },
  args: {
    heading: "Set sail for success",
    description: sv.pageTranslations.home.heroDescription,
    buttons: {
      primary: {
        text: sv.Static.exploreExhibitors,
        url: "/student/exhibitors",
        tracking: {
          eventName: "student_exhibitors_click",
          eventData: { location: "hero_primary" }
        }
      },
      secondary: {
        text: sv.Static.browseOurEvents,
        url: "/student/events"
      }
    }
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", { name: "Utforska utställare" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("link", { name: sv.Static.exploreExhibitors })
    ).toHaveAttribute("href", "/sv/student/exhibitors")
    await expect(
      canvas.getByRole("link", { name: sv.Static.browseOurEvents })
    ).toHaveAttribute("href", "/sv/student/events")
    await expect(
      canvas.queryByRole("link", { name: "Explore exhibitors" })
    ).not.toBeInTheDocument()
  }
}
