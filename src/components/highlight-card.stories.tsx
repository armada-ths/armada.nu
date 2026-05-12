import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { expect } from "storybook/test"

import { HighlightCard } from "./highlight-card"

const meta = {
    title: "Homepage/HighlightCard",
    component: HighlightCard,
    parameters: {
        layout: "centered"
    },
    tags: ["autodocs"],
    decorators: [
        Story => (
            <div className="w-full max-w-md">
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof HighlightCard>

export default meta
type Story = StoryObj<typeof meta>

export const WithCallToAction: Story = {
    args: {
        brand: "ARMADA 2026",
        title: "Meet Armada before the fair",
        subtitle: "Recruitment is open",
        description:
            "Join the project group behind KTH's largest career fair and help shape events, partnerships, and student experiences.",
        ctaText: "Explore roles",
        ctaUrl: "/student/recruitment",
        ctaTracking: {
            eventName: "student_signup_click",
            eventData: {
                location: "storybook_highlight_card"
            }
        }
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByRole("heading", {
                name: "Meet Armada before the fair"
            })
        ).toBeInTheDocument()
        await expect(
            canvas.getByRole("link", {
                name: "Explore roles"
            })
        ).toBeInTheDocument()
    }
}

export const InformationalOnly: Story = {
    args: {
        brand: "ARMADA",
        title: "This year's fair is taking shape",
        subtitle: "More details will follow",
        description:
            "Keep an eye on the homepage for announcements about exhibitors, events, and student opportunities as the fair approaches."
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByRole("heading", {
                name: "This year's fair is taking shape"
            })
        ).toBeInTheDocument()
        await expect(
            canvas.queryByRole("link", {
                name: /explore roles/i
            })
        ).not.toBeInTheDocument()
    }
}