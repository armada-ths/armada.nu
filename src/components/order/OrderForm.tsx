"use client"

import { sendOrderToSlack } from "@/app/exhibitor/actions"
import OrderItem from "@/components/order/OrderItem"
import { Page } from "@/components/shared/Page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type StoreItem = {
  id: string
  name: string
  description?: string
  max?: number
}

type OrderFormProps = {
  exhibitors: string[]
}

const ITEMS: StoreItem[] = [
  { id: "sandwich-turkey", name: "Sandwich (Turkey)", description: "Freshly made with turkey and vegetables" },
  { id: "sandwich-vegetarian", name: "Sandwich (Vegetarian)", description: "Freshly made with cheese and vegetables" },
  { id: "pain-au-chocolat", name: "Pain au Chocolat", description: "Butter pastry with chocolate" },
  { id: "cinnamon-bun", name: "Cinnamon bun", description: "Classic Swedish Kanelbulle" },
  { id: "muffin-chocolate", name: "Muffin (Chocolate)", description: "Soft and rich" },
  { id: "muffin-blueberry", name: "Muffin (Blueberry)", description: "Sweet and fruity" },
  { id: "apple-cake-vegan", name: "Apple Cake (Vegan)", description: "Plant-based apple cake" },
  { id: "chocolate-balls-vegan", name: "Chocolate ball (Vegan)", description: "Classic Swedish Chokladboll" },
  { id: "coffee", name: "Black Coffee", description: "Sugar on the side" },
  { id: "coffee-with-milk", name: "Coffee with Oat milk", description: "Sugar on the side" },
  { id: "tea", name: "Tea", description: "Sugar on the side" },
  { id: "hot-chocolate", name: "Oboy", description: "Warm and Sweet Cocoa drink" },
]


export function OrderForm({ exhibitors }: OrderFormProps) {
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
    if (isSubmitting) return

    if (!company.trim()) {
      toast.warning("Please enter a company name.")
      return
    }

    if (cartLines.length === 0) {
      toast.warning("Your cart is empty.")
      return
    }

    setIsSubmitting(true)

    const message = `Order for ${company}:\n${cartLines.map(l => `- ${l}`).join("\n")}`
    try {
      const result = await sendOrderToSlack(message)
      console.log("Result:", result)
      setIsSubmitting(false)

      if (result.success) {
        toast.success("Submitted!")
        setSubmitted(true)
        setCompany("")
        setCart({})
      } else {
        toast.error(result.error ?? "Submit failed!")
      }
    } catch (err) {
      console.error(err)
    }

  }

  if (submitted) {
    return (
      <Page.Boundary maxWidth={750}>
        <Page.Header>Order</Page.Header>
        <div className="mt-3">
          <h2 className="text-lg font-semibold mb-2">Order submitted!</h2>
          <p>We’ll deliver your order as soon as possible.</p>
          <Button size="sm" className="mt-6" onClick={() => setSubmitted(false)}>
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
          {showDropdown && (filteredCompanies.length > 0 || showCustomOption) && (
            <div className="absolute z-50 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCompanies.length > 0
                ? filteredCompanies.map(name => (
                  <button
                    key={name}
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-700 text-left"
                    onClick={() => {
                      setCompany(name)
                      setShowDropdown(false)
                    }}>
                    <Check
                      className={`h-4 w-4 ${company === name ? "opacity-100" : "opacity-0"
                        }`}
                    />
                    {name}
                  </button>
                ))
                : (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-700 text-left"
                    onClick={() => setShowDropdown(false)}>
                    Use “{company}”
                  </button>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
