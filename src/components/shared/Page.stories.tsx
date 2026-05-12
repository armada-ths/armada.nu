import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { expect } from "storybook/test"

import { P } from "@/app/_components/Paragraph"
import { Button } from "@/components/ui/button"

import { Page } from "./Page"

const meta = {
    title: "Shared/Page",
    component: Page.Boundary,
    parameters: {
        layout: "fullscreen"
    },
    tags: ["autodocs"]
} satisfies Meta<typeof Page.Boundary>

export default meta
type Story = StoryObj<typeof meta>

export const LandingLayout: Story = {
    render: () => (
        <Page.Background withIndents>
            <Page.Boundary maxWidth={820} className="gap-6 pb-16">
                <Page.Header>About Armada</Page.Header>
                <P className="max-w-2xl">
                    Armada connects KTH students with employers through a career fair,
                    events, and year-round opportunities to meet future colleagues.
                </P>
                <Page.Header tier="secondary" className="text-melon mt-4">
                    Why students keep coming back
                </Page.Header>
                <P className="max-w-2xl">
                    The shared page primitives make it easy to keep typography, spacing,
                    and hierarchy aligned across both exhibitor and student pages.
                </P>
                <div className="flex flex-wrap gap-3">
                    <Button>Meet the team</Button>
                    <Button variant="neutral">Read the blog</Button>
                </div>
            </Page.Boundary>
        </Page.Background>
    ),
    play: async ({ canvas }) => {
        await expect(
            canvas.getByRole("heading", {
                name: "About Armada"
            })
        ).toBeInTheDocument()
        await expect(
            canvas.getByRole("heading", {
                name: "Why students keep coming back"
            })
        ).toBeInTheDocument()
    }
}

export const CompactSection: Story = {
    render: () => (
        <Page.Background avoidHeader className="px-5 py-8">
            <Page.Boundary maxWidth={700} className="gap-4">
                <Page.Header tier="secondary" className="text-melon">
                    Upcoming deadlines
                </Page.Header>
                <P className="max-w-xl">
                    Use the compact variant when content appears inside an existing page
                    flow and you do not need the standard navigation offset.
                </P>
            </Page.Boundary>
        </Page.Background>
    ),
    play: async ({ canvas }) => {
        await expect(
            canvas.getByRole("heading", {
                name: "Upcoming deadlines"
            })
        ).toBeInTheDocument()
    }
}