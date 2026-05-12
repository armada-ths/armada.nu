import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import type { BlogPost } from "@/app/blog/_data/posts"
import { PostCard } from "./PostCard"

const mockPost: BlogPost = {
    id: 1,
    userId: 1,
    title: "Armada 2026 — Behind the Scenes",
    text: "An inside look at how 300 student volunteers build one of Europe's largest career fairs.",
    author: "Anna Svensson",
    createdAt: "2026-03-01T10:00:00Z",
    imageUrl: undefined
}

const meta = {
    title: "Blog/PostCard",
    component: PostCard,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    decorators: [
        Story => (
            <div className="w-72">
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof PostCard>

export default meta
type Story = StoryObj<typeof meta>

export const WithFallbackImage: Story = {
    args: { post: mockPost },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText("Armada 2026 — Behind the Scenes")
        ).toBeInTheDocument()
        await expect(canvas.getByRole("link")).toHaveAttribute("href", "/blog/1")
    }
}

export const WithImage: Story = {
    args: {
        post: {
            ...mockPost,
            id: 2,
            title: "Meet the Project Managers",
            imageUrl: "/fair_pictures/2.jpeg"
        }
    }
}

export const LongTitle: Story = {
    args: {
        post: {
            ...mockPost,
            id: 3,
            title:
                "How Armada Connects Students With Over 150 of Sweden's Top Employers Every Year"
        }
    }
}
