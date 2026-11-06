import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within, waitFor } from "storybook/test"
import OrderItem from "./OrderItem"
const meta = {
  title: "Order/OrderItem",
  component: OrderItem,
  tags: ["autodocs"],
  args: {
    name: "Coffee",
    description: "Fresh coffee",
    quantity: 1,
    max: 3,
    onIncrease: fn(),
    onDecrease: fn(),
    onChange: fn()
  },
  decorators: [
    Story => (
      <div className="bg-snow text-licorice w-64 p-4">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof OrderItem>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.queryByRole("button", { name: "Read more" })
    ).not.toBeInTheDocument()
    await expect(getComputedStyle(canvas.getByText("Coffee")).fontWeight).toBe(
      "700"
    )
    const title = canvas.getByText("Coffee")
    const description = canvas.getByText("Fresh coffee")
    await expect(getComputedStyle(title).fontSize).toBe("16px")
    await expect(
      description.getBoundingClientRect().top -
        title.getBoundingClientRect().bottom
    ).toBe(4)
    const card = canvasElement.querySelector<HTMLElement>("[data-order-item]")
    if (!card) throw new Error("Missing item card")
    await expect(card.scrollHeight).toBeLessThanOrEqual(card.clientHeight)
  }
}
export const NoDescription: Story = {
  args: { description: undefined },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole("button", { name: "Read more" })
    ).not.toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: "Increase" })).toBeVisible()
  }
}
export const LongDescription: Story = {
  args: {
    description: "Freshly brewed coffee with a choice of milk. ".repeat(15)
  },
  play: async ({ canvas, canvasElement }) => {
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Read more" })).toBeVisible()
    )
    const card = canvasElement.querySelector<HTMLElement>("[data-order-item]")
    if (!card) throw new Error("Missing item card")
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth)
    const chevron = canvas.getByRole("button", { name: "Read more" })
    await expect(chevron.getBoundingClientRect().right).toBeLessThanOrEqual(
      card.getBoundingClientRect().right
    )
    await userEvent.click(canvas.getByRole("button", { name: "Read more" }))
    const dialog = within(canvasElement.ownerDocument.body).getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(
      within(dialog).getByText(
        "Freshly brewed coffee with a choice of milk. ".repeat(15).trim()
      )
    ).toBeVisible()
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }))
    await expect(dialog).not.toBeVisible()
  }
}
export const ResponsiveDescription: Story = {
  args: { description: "Probably the best beverage available in the lounge" },
  play: async ({ canvas, canvasElement }) => {
    const wrapper = canvasElement.querySelector<HTMLElement>(".w-64")
    if (!wrapper) throw new Error("Missing story wrapper")
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Read more" })).toBeVisible()
    )
    wrapper.style.width = "600px"
    await waitFor(() =>
      expect(
        canvas.queryByRole("button", { name: "Read more" })
      ).not.toBeInTheDocument()
    )
    wrapper.style.width = "160px"
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Read more" })).toBeVisible()
    )
    wrapper.style.width = ""
  }
}
export const SoldOut: Story = {
  args: { unavailable: true, soldOutLabel: "Sold out" }
}
export const SwedishSoldOut: Story = {
  globals: { locale: "sv" },
  args: {
    name: "Kaffe",
    description: "Nybryggt kaffe",
    unavailable: true,
    soldOutLabel: "Slutsåld",
    labels: {
      decrease: "Minska",
      quantity: "Antal",
      increase: "Öka",
      readMore: "Läs mer",
      close: "Stäng"
    }
  }
}
