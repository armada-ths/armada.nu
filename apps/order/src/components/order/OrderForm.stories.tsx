import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, mocked, userEvent, waitFor, within } from "storybook/test"
import { Toaster } from "@armada/shared/ui/sonner"
import { OrderForm } from "./OrderForm"

const meta = {
  title: "Order/OrderForm",
  component: OrderForm,
  tags: ["autodocs"],
  args: {
    exhibitors: ["Example AB"],
    submitOrder: fn().mockResolvedValue({ success: true })
  },
  decorators: [
    Story => (
      <div className="bg-coconut text-licorice min-h-screen p-5">
        <Story />
        <Toaster />
      </div>
    )
  ]
} satisfies Meta<typeof OrderForm>
export default meta
type Story = StoryObj<typeof meta>

export const Submit: Story = {
  beforeEach: ({ args }) => {
    mocked(args.submitOrder).mockResolvedValue({ success: true })
  },
  play: async ({ canvas, args }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Company" }),
      "Custom AB"
    )
    await userEvent.click(
      canvas.getByRole("button", { name: "Use “Custom AB”" })
    )
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await expect(args.submitOrder).toHaveBeenCalled()
    await expect(await canvas.findByText("Order submitted!")).toBeVisible()
    await expect(args.submitOrder).toHaveBeenCalledWith({
      company: "Custom AB",
      items: [{ id: "sandwich-turkey", quantity: 1 }]
    })
    await userEvent.click(canvas.getByRole("button", { name: "New order" }))
    await expect(canvas.getByRole("textbox", { name: "Company" })).toHaveValue(
      ""
    )
  }
}

export const DeliveryFailure: Story = {
  beforeEach: ({ args }) => {
    mocked(args.submitOrder).mockResolvedValue({
      success: false,
      error: "Delivery failed"
    })
  },
  args: {
    submitOrder: fn().mockResolvedValue({
      success: false,
      error: "Delivery failed"
    })
  },
  play: async ({ canvas, canvasElement, args }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Company" }),
      "Example AB"
    )
    await userEvent.click(canvas.getByRole("button", { name: "Example AB" }))
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByText("Delivery failed")
      ).toBeVisible()
    )
    await expect(canvas.getByRole("button", { name: "Send" })).toBeEnabled()
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await expect(args.submitOrder).toHaveBeenCalledTimes(2)
  }
}

export const SwedishSubmit: Story = {
  beforeEach: ({ args }) => {
    mocked(args.submitOrder).mockResolvedValue({ success: true })
  },
  args: {
    locale: "sv",
    submitOrder: fn().mockResolvedValue({ success: true })
  },
  play: async ({ canvas, args }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Företag" }),
      "Example AB"
    )
    await userEvent.click(canvas.getByRole("button", { name: "Example AB" }))
    await userEvent.click(canvas.getAllByRole("button", { name: "Öka" })[0])
    await userEvent.click(canvas.getByRole("button", { name: "Skicka" }))
    await expect(
      await canvas.findByText("Beställningen är skickad!")
    ).toBeVisible()
    await expect(args.submitOrder).toHaveBeenCalledWith({
      company: "Example AB",
      items: [{ id: "sandwich-turkey", quantity: 1 }]
    })
  }
}
