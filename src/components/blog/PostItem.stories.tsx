import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { PostItem } from "./PostItem"

const meta = {
  title: "Blog/PostItem",
  component: PostItem,
  tags: ["autodocs"],
  args: {
    post: {
      id: 1,
      userId: 1,
      title: "A day at Armada",
      author: "Armada team",
      text: "Students met employers and explored new opportunities at this year's fair.",
      createdAt: "2026-09-01T12:00:00Z",
      imageUrl: "/fair_pictures/2.jpeg"
    }
  }
} satisfies Meta<typeof PostItem>
export default meta
type Story = StoryObj<typeof meta>

export const ExistingPost: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img")).toBeVisible()
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument()
  }
}
export const Gallery: Story = {
  args: {
    post: {
      ...meta.args.post,
      imageUrls: ["/fair_pictures/49121473038_5876d71e29_b.jpg"]
    }
  }
}
export const HiddenHeader: Story = {
  args: {
    post: {
      ...meta.args.post,
      showCoverInPost: false,
      imageUrls: ["/fair_pictures/2.jpeg"]
    }
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("region")).not.toBeInTheDocument()
    await expect(canvas.getByText(meta.args.post.text)).toBeVisible()
  }
}
export const FallbackImage: Story = {
  args: { post: { ...meta.args.post, imageUrl: undefined } },
  play: async ({ canvas }) => {
    // Storybook's Next.js image loader can append sizing/quality parameters.
    await expect(canvas.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringMatching(/^\/armada_white\.svg(?:\?.*)?$/)
    )
  }
}
