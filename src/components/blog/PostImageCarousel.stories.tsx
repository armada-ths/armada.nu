import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { PostImageCarousel } from "./PostImageCarousel"

const meta = {
  title: "Blog/PostImageCarousel",
  component: PostImageCarousel,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="mx-auto mt-6 max-w-4xl">
        <Story />
      </div>
    )
  ],
  args: {
    title: "A day at Armada",
    images: [
      "/fair_pictures/2.jpeg",
      "/fair_pictures/49121473038_5876d71e29_b.jpg",
      "/fair_pictures/49121988801_f0b111943f_k.jpg"
    ]
  }
} satisfies Meta<typeof PostImageCarousel>

export default meta
type Story = StoryObj<typeof meta>

export const MultipleImages: Story = {
  play: async ({ canvas }) => {
    const next = canvas.getByRole("button", { name: "Next slide" })
    const previous = canvas.getByRole("button", { name: "Previous slide" })
    await waitFor(() => expect(next).toBeEnabled())
    await userEvent.click(next)
    await expect(
      canvas.getByRole("img", { name: "A day at Armada — photo 2" })
    ).toBeVisible()
    await userEvent.click(previous)
    await expect(
      canvas.getByRole("img", { name: "A day at Armada — photo 1" })
    ).toBeVisible()
    await userEvent.click(previous)
    await expect(
      canvas.getByRole("img", { name: "A day at Armada — photo 3" })
    ).toBeVisible()
    await userEvent.keyboard("{ArrowRight}")
    await expect(
      canvas.getByRole("img", { name: "A day at Armada — photo 1" })
    ).toBeVisible()
  }
}

export const AutomaticRotation: Story = {
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText("2 / 3")).toBeInTheDocument(), {
      timeout: 7000
    })
    await userEvent.click(
      canvas.getByRole("button", { name: "Pause slideshow" })
    )
    await expect(
      canvas.getByRole("button", { name: "Play slideshow" })
    ).toBeInTheDocument()
    await new Promise(resolve => setTimeout(resolve, 5200))
    await expect(canvas.getByText("2 / 3")).toBeInTheDocument()
  }
}

export const SingleImage: Story = {
  args: { images: ["/fair_pictures/2.jpeg"] },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("img", { name: "A day at Armada" })
    ).toBeVisible()
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument()
  }
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } }
}
