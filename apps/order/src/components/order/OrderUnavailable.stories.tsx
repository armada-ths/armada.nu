import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { OrderUnavailable } from "./OrderUnavailable"
const meta = {
  title: "Order/OrderUnavailable",
  component: OrderUnavailable,
  tags: ["autodocs"],
  args: { code: "availability_unavailable" }
} satisfies Meta<typeof OrderUnavailable>
export default meta
type Story = StoryObj<typeof meta>
export const Unavailable: Story = {}
export const Swedish: Story = { globals: { locale: "sv" } }
