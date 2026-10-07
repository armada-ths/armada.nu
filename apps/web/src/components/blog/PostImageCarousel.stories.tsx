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
  parameters: {
    docs: {
      description: {
        story:
          "Controls have a 36px translucent square inside a 44px hit area, with stronger backgrounds on hover and keyboard focus. The image counter uses the same background opacity."
      }
    }
  },
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
  globals: { viewport: { value: "mobile", isRotated: false } },
  parameters: {
    viewport: {
      options: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "812px" } }
      }
    }
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole("button", { name: "Next slide" })
    ).not.toBeInTheDocument()
    const imageBounds = canvas.getByRole("region").getBoundingClientRect()
    const dotBounds = canvas
      .getByRole("group", { name: "Choose photo" })
      .getBoundingClientRect()
    await expect(
      Math.abs(
        dotBounds.left +
          dotBounds.width / 2 -
          (imageBounds.left + imageBounds.width / 2)
      )
    ).toBeLessThan(1)
    const third = canvas.getByRole("button", { name: "Go to photo 3 of 3" })
    await waitFor(() => expect(third).toBeEnabled())
    for (const dot of canvas.getAllByRole("button", { name: /Go to photo/ })) {
      await expect(dot.getBoundingClientRect().width).toBe(32)
      await expect(dot.getBoundingClientRect().height).toBe(44)
      await expect(
        dot.querySelector("span")?.getBoundingClientRect().width
      ).toBe(6)
    }
    const pause = canvas.getByRole("button", { name: "Pause slideshow" })
    await expect(getComputedStyle(pause, "::before").width).toBe("28px")
    await userEvent.click(third)
    await waitFor(() => expect(third).toHaveAttribute("aria-current", "true"))
    await expect(
      canvas.getByRole("button", { name: "Play slideshow" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("img", { name: "A day at Armada — photo 3" })
    ).toBeVisible()
  }
}

export const ControlAppearance: Story = {
  play: async ({ canvas }) => {
    const previous = canvas.getByRole("button", { name: "Previous slide" })
    await waitFor(() => expect(previous).toBeEnabled())
    for (const control of canvas.getAllByRole("button")) {
      const bounds = control.getBoundingClientRect()
      await expect(bounds.width).toBeGreaterThanOrEqual(44)
      await expect(bounds.height).toBeGreaterThanOrEqual(44)
      await expect(getComputedStyle(control).borderTopWidth).toBe("0px")
      await expect(getComputedStyle(control, "::before").width).toBe("36px")
    }
    await userEvent.tab()
    await expect(previous).toHaveFocus()
    await waitFor(() =>
      expect(
        Number(
          getComputedStyle(previous, "::before").backgroundColor.match(
            /\/\s*([\d.]+)\)/
          )?.[1]
        )
      ).toBeGreaterThanOrEqual(0.85)
    )
  }
}
