import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, mocked, userEvent, waitFor, within } from "storybook/test"
import { Toaster } from "@armada/shared/ui/sonner"
import { OrderForm } from "./OrderForm"
import type { OrderData } from "@order/lib/catalogue"

const data: OrderData = {
  categories: [
    {
      id: 1,
      name: "Drinks and snacks",
      nameSv: "Dryck och snacks",
      sortOrder: 0
    }
  ],
  exhibitors: [{ id: 1, name: "Example AB", tier: "Gold" }],
  items: [
    {
      id: 1,
      categoryId: 1,
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
      categoryId: 1,
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
    submitOrder: fn().mockResolvedValue({ success: true, orderId: 42 })
  },
  beforeEach: ({ args }) => {
    mocked(args.refreshData).mockResolvedValue({
      success: true,
      data: args.data
    })
    mocked(args.submitOrder).mockResolvedValue({ success: true, orderId: 42 })
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
      idempotencyKey: expect.any(String),
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
    await expect(canvas.getByRole("button", { name: "Send" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await expect(
      canvas.getByText("Please select a Gold exhibitor.")
    ).toBeVisible()
    await expect(
      canvas.getByRole("combobox", { name: "Company" })
    ).toHaveFocus()
    await expect(args.submitOrder).not.toHaveBeenCalled()
  }
}

export const MissingCompanyAndCart: Story = {
  play: async ({ canvas, args }) => {
    const company = canvas.getByRole("combobox", { name: "Company" })
    const send = canvas.getByRole("button", { name: "Send" })
    await expect(company).toBeRequired()
    await expect(canvas.getByText("(required)")).toBeVisible()
    await userEvent.click(send)
    await expect(company).toHaveFocus()
    await expect(company).toHaveAttribute("aria-invalid", "true")
    await expect(
      canvas.getByText("Please select a Gold exhibitor.")
    ).toBeVisible()
    await expect(canvas.getByText("Your cart is empty.")).toBeVisible()
    await expect(args.submitOrder).not.toHaveBeenCalled()
    await selectCompany(canvas)
    await expect(
      canvas.queryByText("Please select a Gold exhibitor.")
    ).not.toBeInTheDocument()
    send.focus()
    await userEvent.keyboard("{Enter}")
    await expect(canvas.getByText("Your cart is empty.")).toBeVisible()
    await expect(args.submitOrder).not.toHaveBeenCalled()
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    await expect(
      canvas.queryByText("Your cart is empty.")
    ).not.toBeInTheDocument()
    await expect(send).toHaveAttribute("aria-disabled", "false")
  }
}

export const SwedishMissingCompanyAndCart: Story = {
  globals: { locale: "sv" },
  play: async ({ canvas, args }) => {
    const send = canvas.getByRole("button", { name: "Skicka" })
    await expect(canvas.getByText("(obligatoriskt)")).toBeVisible()
    send.focus()
    await userEvent.keyboard("{Enter}")
    await expect(canvas.getByText("Välj en guldutställare.")).toBeVisible()
    await expect(canvas.getByText("Varukorgen är tom.")).toBeVisible()
    await expect(
      canvas.getByRole("combobox", { name: "Företag" })
    ).toHaveFocus()
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

export const PersistenceFailure: Story = {
  beforeEach: ({ args }) => {
    mocked(args.submitOrder).mockResolvedValue({
      success: false,
      errorCode: "submission_failed"
    })
  },
  args: {
    submitOrder: fn().mockResolvedValue({
      success: false,
      errorCode: "submission_failed"
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
          "Could not submit your order. Check your connection and try again."
        )
      ).toBeVisible()
    )
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Send" })).toBeEnabled()
    )
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await expect(args.submitOrder).toHaveBeenCalledTimes(2)
    const calls = mocked(args.submitOrder).mock.calls
    await expect(calls[0][0].idempotencyKey).toBe(calls[1][0].idempotencyKey)
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
      idempotencyKey: expect.any(String),
      items: [{ id: "1", quantity: 1 }]
    })
  }
}
export const EmptyMenu: Story = { args: { data: { ...data, items: [] } } }
export const CartRows: Story = {
  args: {
    data: {
      ...data,
      items: data.items.map(item => ({ ...item, soldOut: false }))
    }
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[0]
    )
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Increase" })[1]
    )
    const cart = within(canvas.getByRole("region", { name: "Cart:" }))
    const removeCoffee = cart.getByRole("button", { name: "Remove Coffee" })
    const removeBun = cart.getByRole("button", { name: "Remove Cinnamon bun" })
    await expect(removeCoffee.textContent).toBe("")
    const icon = removeCoffee.querySelector("svg")
    if (!icon) throw new Error("Missing trash icon")
    await expect(removeCoffee).toHaveClass("text-red-700")
    await expect(getComputedStyle(icon).color).toBe(
      getComputedStyle(removeCoffee).color
    )
    const row = removeCoffee.closest("li")
    if (!row) throw new Error("Missing cart row")
    await expect(getComputedStyle(icon).color).not.toBe(
      getComputedStyle(row).color
    )
    await expect(removeCoffee.getBoundingClientRect().right).toBe(
      removeBun.getBoundingClientRect().right
    )
    await userEvent.click(removeCoffee)
    await expect(cart.queryByText("Coffee")).not.toBeInTheDocument()
    await expect(cart.getByText("Cinnamon bun")).toBeVisible()
    await userEvent.click(removeBun)
    await expect(cart.getByText("(empty)")).toBeVisible()
  }
}
export const SwedishCart: Story = {
  globals: { locale: "sv" },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getAllByRole("button", { name: "Öka" })[0])
    const cart = within(canvas.getByRole("region", { name: "Varukorg:" }))
    await userEvent.click(cart.getByRole("button", { name: "Ta bort Kaffe" }))
    await expect(cart.getByText("(tom)")).toBeVisible()
  }
}
export const EqualSizedCategories: Story = {
  args: {
    data: {
      ...data,
      categories: [
        ...data.categories,
        { id: 2, name: "Fruit", nameSv: "Frukt", sortOrder: 1 }
      ],
      items: [
        ...data.items,
        {
          id: 3,
          categoryId: 2,
          name: "Fresh seasonal fruit with a very long product name",
          nameSv: "Säsongens färska frukt med ett mycket långt produktnamn",
          description: "A changing selection of seasonal fruit. ".repeat(15),
          descriptionSv: "Ett varierat urval av säsongens frukt. ".repeat(15),
          sortOrder: 0,
          soldOut: false
        }
      ]
    }
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("heading", { name: "Fruit" })).toBeVisible()
    const cards = [...canvasElement.querySelectorAll('[data-slot="card"]')]
    const height = cards[0].getBoundingClientRect().height
    await expect(height).toBe(128)
    for (const card of cards) {
      await expect(card.getBoundingClientRect().height).toBe(height)
      await expect(card.scrollHeight).toBeLessThanOrEqual(card.clientHeight)
      await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth)
      const title = card.querySelector<HTMLElement>(".font-bold")
      const controls = card.querySelector<HTMLInputElement>("input")
      const firstTitle = cards[0].querySelector<HTMLElement>(".font-bold")
      const firstControls = cards[0].querySelector<HTMLInputElement>("input")
      if (!title || !controls || !firstTitle || !firstControls)
        throw new Error("Missing card title or quantity controls")
      await expect(getComputedStyle(title).fontSize).toBe("16px")
      await expect(
        title.getBoundingClientRect().top - card.getBoundingClientRect().top
      ).toBe(
        firstTitle.getBoundingClientRect().top -
          cards[0].getBoundingClientRect().top
      )
      await expect(
        controls.getBoundingClientRect().bottom -
          card.getBoundingClientRect().top
      ).toBe(
        firstControls.getBoundingClientRect().bottom -
          cards[0].getBoundingClientRect().top
      )
    }
    const details = canvas.getAllByRole("button", { name: "Read more" })
    await userEvent.click(details[details.length - 1])
    await expect(canvas.getByRole("dialog")).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
    )
  }
}
export const SwedishCategories: Story = {
  ...EqualSizedCategories,
  globals: { locale: "sv" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("heading", { name: "Frukt" })).toBeVisible()
    const cards = [...canvasElement.querySelectorAll('[data-slot="card"]')]
    for (const card of cards)
      await expect(card.getBoundingClientRect().height).toBe(128)
    const details = canvas.getAllByRole("button", { name: "Läs mer" })
    await userEvent.click(details[details.length - 1])
    await expect(canvas.getByRole("dialog")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Stäng" }))
  }
}
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
    const cards = [...canvasElement.querySelectorAll("[data-order-item]")]
    await expect(cards.length).toBeGreaterThan(1)
    const height = cards[0].getBoundingClientRect().height
    for (const item of cards)
      await expect(item.getBoundingClientRect().height).toBe(height)
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
