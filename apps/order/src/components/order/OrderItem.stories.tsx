import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"
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
export const NoPicture: Story = {}
export const WithPicture: Story = { args: { imageUrl: "/icons/favicon.ico" } }
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
    labels: { decrease: "Minska", quantity: "Antal", increase: "Öka" }
  }
}
