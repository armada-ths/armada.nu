import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, mocked, userEvent, waitFor, within } from "storybook/test"
import { Toaster } from "@armada/shared/ui/sonner"
import { OrderForm } from "./OrderForm"
import type { OrderData } from "@order/lib/catalogue"

const data: OrderData = {
  exhibitors: [{ id: 1, name: "Example AB", tier: "Gold" }],
  items: [
    {
      id: 1,
      name: "Coffee",
      nameSv: "Kaffe",
      description: "Fresh coffee",
      descriptionSv: "Nybryggt kaffe",
      sortOrder: 0,
      soldOut: false,
      maxPerOrder: 3
    },
    {
      id: 2,
      name: "Cinnamon bun",
      nameSv: "Kanelbulle",
      sortOrder: 1,
      soldOut: true
    }
  ]
}
const meta = {
  title: "Order/OrderForm",
  component: OrderForm,
  tags: ["autodocs"],
  args: {
    data,
    refreshData: fn().mockResolvedValue({ success: true, data }),
    submitOrder: fn().mockResolvedValue({ success: true })
  },
  beforeEach: ({ args }) => {
    mocked(args.refreshData).mockResolvedValue({
      success: true,
      data: args.data
    })
    mocked(args.submitOrder).mockResolvedValue({ success: true })
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

async function selectCompany(
  canvas: ReturnType<typeof within>,
  name = "Company"
) {
  await userEvent.click(canvas.getByRole("combobox", { name }))
  await userEvent.click(canvas.getByRole("option", { name: "Example AB" }))
  await waitFor(() =>
    expect(
      canvas.getAllByRole("button", {
        name: name === "Företag" ? "Öka" : "Increase"
      })[0]
    ).toBeEnabled()
  )
}

export const Submit: Story = {
  play: async ({ canvas, args }) => {
    await selectCompany(canvas)
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    await expect(
      canvas.getAllByRole("button", { name: "Increase" })[1]
    ).toBeDisabled()
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await expect(await canvas.findByText("Order submitted!")).toBeVisible()
    await expect(args.submitOrder).toHaveBeenCalledWith({
      exhibitorId: 1,
      items: [{ id: "1", quantity: 1 }]
    })
    await userEvent.click(canvas.getByRole("button", { name: "New order" }))
    await expect(canvas.getByRole("combobox", { name: "Company" })).toHaveValue(
      ""
    )
  }
}

export const CustomCompanyRejected: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(
      canvas.getByRole("combobox", { name: "Company" }),
      "Custom AB"
    )
    await expect(canvas.getByText("No eligible companies found.")).toBeVisible()
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled()
    await expect(args.submitOrder).not.toHaveBeenCalled()
  }
}

export const KeyboardSelection: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Company" }))
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await expect(canvas.getByRole("combobox", { name: "Company" })).toHaveValue(
      "Example AB"
    )
    await expect(canvas.queryByRole("listbox")).not.toBeInTheDocument()
  }
}

export const DeliveryFailure: Story = {
  beforeEach: ({ args }) => {
    mocked(args.submitOrder).mockResolvedValue({
      success: false,
      errorCode: "delivery_failed"
    })
  },
  args: {
    submitOrder: fn().mockResolvedValue({
      success: false,
      errorCode: "delivery_failed"
    })
  },
  play: async ({ canvas, canvasElement, args }) => {
    await selectCompany(canvas)
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByText(
          "Could not deliver your order. Please try again."
        )
      ).toBeVisible()
    )
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Send" })).toBeEnabled()
    )
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await expect(args.submitOrder).toHaveBeenCalledTimes(2)
  }
}

export const AvailabilityChanged: Story = {
  beforeEach: ({ args }) => {
    mocked(args.submitOrder).mockResolvedValue({
      success: false,
      errorCode: "items_changed"
    })
    mocked(args.refreshData).mockResolvedValue({ success: true, data })
  },
  args: {
    submitOrder: fn().mockResolvedValue({
      success: false,
      errorCode: "items_changed"
    }),
    refreshData: fn().mockResolvedValue({
      success: true,
      data: {
        ...data,
        items: data.items.map(item => ({ ...item, soldOut: true }))
      }
    })
  },
  play: async ({ canvas, args }) => {
    await selectCompany(canvas)
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    mocked(args.refreshData).mockResolvedValue({
      success: true,
      data: {
        ...data,
        items: data.items.map(item => ({ ...item, soldOut: true }))
      }
    })
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await waitFor(() => expect(args.refreshData).toHaveBeenCalled())
    await expect(
      await canvas.findByText(
        "Remove unavailable items or reduce quantities before sending your order."
      )
    ).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled()
    await userEvent.click(canvas.getByRole("button", { name: "Remove Coffee" }))
    await expect(canvas.getByText("(empty)")).toBeVisible()
  }
}

export const RefreshFailure: Story = {
  beforeEach: ({ args }) => {
    mocked(args.submitOrder).mockResolvedValue({
      success: false,
      errorCode: "availability_unavailable"
    })
    mocked(args.refreshData).mockResolvedValue({ success: true, data })
  },
  args: {
    submitOrder: fn().mockResolvedValue({
      success: false,
      errorCode: "availability_unavailable"
    }),
    refreshData: fn().mockResolvedValue({
      success: false,
      errorCode: "availability_unavailable"
    })
  },
  play: async ({ canvas, args }) => {
    await selectCompany(canvas)
    mocked(args.refreshData).mockResolvedValue({
      success: false,
      errorCode: "availability_unavailable"
    })
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await expect(
      await canvas.findByRole("button", { name: "Retry" })
    ).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled()
    mocked(args.refreshData).mockResolvedValue({ success: true, data })
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }))
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Send" })).toBeEnabled()
    )
  }
}

export const SwedishSubmit: Story = {
  globals: { locale: "sv" },
  play: async ({ canvas, args }) => {
    await selectCompany(canvas, "Företag")
    await expect(canvas.getByText("Nybryggt kaffe")).toBeVisible()
    await userEvent.click(canvas.getAllByRole("button", { name: "Öka" })[0])
    await userEvent.click(canvas.getByRole("button", { name: "Skicka" }))
    await expect(
      await canvas.findByText("Beställningen är skickad!")
    ).toBeVisible()
    await expect(args.submitOrder).toHaveBeenCalledWith({
      exhibitorId: 1,
      items: [{ id: "1", quantity: 1 }]
    })
  }
}
export const EmptyMenu: Story = { args: { data: { ...data, items: [] } } }
export const NoGoldCompanies: Story = {
  args: { data: { ...data, exhibitors: [] } }
}

function contrastRatio(foreground: string, background: string) {
  function luminance(color: string) {
    const channels = color
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(value => {
        const channel = Number(value) / 255
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4
      })
    if (!channels || channels.length !== 3)
      throw new Error("Expected an RGB color")
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  }
  const a = luminance(foreground),
    b = luminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

export const ContrastAndLayout: Story = {
  play: async ({ canvas, canvasElement }) => {
    const title = canvas.getByText("Coffee")
    const card = title.closest('[data-slot="card"]')
    if (!card) throw new Error("Missing product card")
    const background = getComputedStyle(card).backgroundColor
    await expect(background).toBe("rgb(255, 255, 255)")
    await expect(
      contrastRatio(getComputedStyle(title).color, background)
    ).toBeGreaterThanOrEqual(4.5)
    await expect(
      contrastRatio(
        getComputedStyle(canvas.getByText("Fresh coffee")).color,
        background
      )
    ).toBeGreaterThanOrEqual(4.5)
    await userEvent.click(canvas.getByRole("combobox", { name: "Company" }))
    const option = canvas.getByRole("option", { name: "Example AB" })
    await expect(
      contrastRatio(
        getComputedStyle(option).color,
        getComputedStyle(canvas.getByRole("listbox")).backgroundColor
      )
    ).toBeGreaterThanOrEqual(4.5)
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      window.innerWidth
    )
    for (const input of canvas.getAllByRole("textbox", { name: "Quantity" })) {
      const parent = input.parentElement
      if (!parent) throw new Error("Missing quantity controls")
      await expect(parent.scrollWidth).toBeLessThanOrEqual(parent.clientWidth)
    }
  }
}

export const RefreshOnFocus: Story = {
  play: async ({ canvas, args }) => {
    await selectCompany(canvas)
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    mocked(args.refreshData).mockClear()
    mocked(args.refreshData).mockResolvedValue({
      success: true,
      data: { ...data, items: [] }
    })
    window.dispatchEvent(new Event("focus"))
    await waitFor(() => expect(args.refreshData).toHaveBeenCalledTimes(1))
    await expect(
      await canvas.findByText(
        "Remove unavailable items or reduce quantities before sending your order."
      )
    ).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Remove Coffee" })
    ).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled()
  }
}
