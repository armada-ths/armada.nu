"use client"

import OrderItem from "@order/components/order/OrderItem"
import { Page } from "@armada/shared/Page"
import { Button } from "@armada/shared/ui/button"
import { Card } from "@armada/shared/ui/card"
import { Input } from "@armada/shared/ui/input"
import { Check } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { ITEMS } from "@order/lib/catalogue"
import type { OrderInput, OrderResult } from "@order/lib/orders"

type OrderFormProps = {
  exhibitors: string[]
  submitOrder: (input: OrderInput) => Promise<OrderResult>
}

export function OrderForm({ exhibitors, submitOrder }: OrderFormProps) {
  const submissionLock = useRef(false)
  const [company, setCompany] = useState("")
  const [cart, setCart] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredCompanies = company
    ? exhibitors.filter(c => c.toLowerCase().includes(company.toLowerCase()))
    : []

  const showCustomOption = company && filteredCompanies.length === 0

  function updateCart(itemId: string, qty: number) {
    const n = Math.max(0, Math.floor(qty))
    setCart(prev => {
      if (n === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [itemId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [itemId]: n }
    })
  }

  function adjustQty(itemId: string, delta: number) {
    updateCart(itemId, (cart[itemId] ?? 0) + delta)
  }

  const cartLines = Object.entries(cart).map(([id, qty]) => {
    const item = ITEMS.find(i => i.id === id)
    return item ? `${item.name} x${qty}` : `${id} x${qty}`
  })

  async function sendMessage() {
    if (submissionLock.current) return

    if (!company.trim()) {
      toast.warning("Please enter a company name.")
      return
    }

    if (cartLines.length === 0) {
      toast.warning("Your cart is empty.")
      return
    }

    submissionLock.current = true
    setIsSubmitting(true)

    try {
      const result = await submitOrder({
        company,
        items: Object.entries(cart).map(([id, quantity]) => ({ id, quantity }))
      })
      setIsSubmitting(false)

      if (result.success) {
        toast.success("Submitted!")
        setSubmitted(true)
        setCompany("")
        setCart({})
      } else {
        toast.error(result.error ?? "Submit failed!")
      }
    } catch {
      toast.error("Could not submit your order. Please try again.")
    } finally {
      submissionLock.current = false
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Page.Boundary maxWidth={750}>
        <Page.Header>Order</Page.Header>
        <div className="mt-3">
          <h2 className="mb-2 text-lg font-semibold">Order submitted!</h2>
          <p>We’ll deliver your order as soon as possible.</p>
          <Button
            size="sm"
            className="mt-6"
            onClick={() => setSubmitted(false)}>
            New order
          </Button>
        </div>
      </Page.Boundary>
    )
  }

  return (
    <Page.Boundary maxWidth={750}>
      <Page.Header>Order</Page.Header>
      <p className="mt-2 text-stone-400">
        Here you can order drinks and snacks for your booth during Armada.
        <br />
        <br />
        Use this form for delivery straight to your booth – or feel free to drop
        by the lounge for a friendly chat and a fresh cup of coffee. (If you
        have any questions about ingredients or allergies, please come by the
        lounge and we’ll be happy to help.)
      </p>

      {/* Company combobox */}
      <div className="mt-6">
        <label className="mb-1 text-sm" htmlFor="company">
          Company
        </label>
        <div className="relative">
          <Input
            id="company"
            value={company}
            onChange={e => {
              setCompany(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => company && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Select your company"
          />
          {showDropdown &&
            (filteredCompanies.length > 0 || showCustomOption) && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-700 bg-zinc-800 shadow-lg">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map(name => (
                    <button
                      key={name}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-zinc-700"
                      onClick={() => {
                        setCompany(name)
                        setShowDropdown(false)
                      }}>
                      <Check
                        className={`h-4 w-4 ${
                          company === name ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {name}
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-zinc-700"
                    onClick={() => setShowDropdown(false)}>
                    Use “{company}”
                  </button>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {ITEMS.map(item => (
          <Card key={item.id} className="p-4">
            <OrderItem
              name={item.name}
              description={item.description}
              max={item.max}
              quantity={cart[item.id] ?? 0}
              onIncrease={() => adjustQty(item.id, 1)}
              onDecrease={() => adjustQty(item.id, -1)}
              onChange={n => updateCart(item.id, n)}
            />
          </Card>
        ))}
      </div>

      {/* Cart summary */}
      <div className="mt-6 text-sm text-stone-300">
        <span className="font-medium">Cart:</span>{" "}
        {cartLines.length === 0 ? "(empty)" : cartLines.join(", ")}
      </div>

      <div className="mt-4 flex items-end gap-4">
        <div className="ml-auto">
          <Button onClick={sendMessage} disabled={isSubmitting}>
            Send
          </Button>
        </div>
      </div>
    </Page.Boundary>
  )
}
