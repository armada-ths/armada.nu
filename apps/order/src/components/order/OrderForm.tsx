"use client"
import { useMessages, useTranslations, useFormatter } from "next-intl"
import { useDraftState } from "@armada/shared/i18n/client"
import en from "@order/i18n/messages/en.json"

import OrderItem from "@order/components/order/OrderItem"
import { Page } from "@armada/shared/Page"
import { Button } from "@armada/shared/ui/button"
import { Card } from "@armada/shared/ui/card"
import { Input } from "@armada/shared/ui/input"
import { Check } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { ITEMS } from "@order/lib/catalogue"
import type { OrderInput, OrderResult, OrderErrorCode } from "@order/lib/orders"

type OrderFormProps = {
  exhibitors: string[]
  submitOrder: (input: OrderInput) => Promise<OrderResult>
}

export function OrderForm({ exhibitors, submitOrder }: OrderFormProps) {
  const format = useFormatter()
  const t = useTranslations("Order")
  const products = useTranslations("Products")
  const dict = useMessages().Order as typeof en.Order
  const items = ITEMS.map(item => {
    const nameKey = (item.id + ".name") as Parameters<typeof products>[0]
    const descriptionKey = (item.id + ".description") as Parameters<
      typeof products
    >[0]
    return {
      ...item,
      name: products.has(nameKey) ? products(nameKey) : item.name,
      description: products.has(descriptionKey)
        ? products(descriptionKey)
        : item.description
    }
  })
  const submissionLock = useRef(false)
  const [company, setCompany] = useDraftState("company", "")
  const [cart, setCart] = useDraftState<Record<string, number>>("cart", {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useDraftState("submitted", false)
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
    const item = items.find(i => i.id === id)
    return item
      ? item.name + " × " + format.number(qty)
      : id + " × " + format.number(qty)
  })

  async function sendMessage() {
    if (submissionLock.current) return

    if (!company.trim()) {
      toast.warning(<OrderFeedback code="emptyCompany" />)
      return
    }

    if (cartLines.length === 0) {
      toast.warning(<OrderFeedback code="emptyCart" />)
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
        toast.success(<OrderFeedback code="submittedToast" />)
        setSubmitted(true)
        setCompany("")
        setCart({})
      } else {
        toast.error(<OrderErrorFeedback code={result.errorCode} />)
      }
    } catch {
      toast.error(<OrderErrorFeedback code="submission_failed" />)
    } finally {
      submissionLock.current = false
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Page.Boundary maxWidth={750}>
        <Page.Header>{dict.heading}</Page.Header>
        <div className="mt-3">
          <h2 className="mb-2 text-lg font-semibold">
            {dict.submittedHeading}
          </h2>
          <p>{dict.submittedBody}</p>
          <Button
            size="sm"
            className="mt-6"
            onClick={() => setSubmitted(false)}>
            {dict.newOrder}
          </Button>
        </div>
      </Page.Boundary>
    )
  }

  return (
    <Page.Boundary maxWidth={750}>
      <Page.Header>{dict.heading}</Page.Header>
      <p className="mt-2 whitespace-pre-line text-stone-400">{dict.intro}</p>

      {/* Company combobox */}
      <div className="mt-6">
        <label className="mb-1 text-sm" htmlFor="company">
          {dict.companyLabel}
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
            placeholder={dict.companyPlaceholder}
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
                    {t("useCustomCompany", { company })}
                  </button>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map(item => (
          <Card key={item.id} className="p-4">
            <OrderItem
              name={item.name}
              description={item.description}
              max={item.max}
              quantity={cart[item.id] ?? 0}
              onIncrease={() => adjustQty(item.id, 1)}
              onDecrease={() => adjustQty(item.id, -1)}
              onChange={n => updateCart(item.id, n)}
              labels={dict.controls}
            />
          </Card>
        ))}
      </div>

      {/* Cart summary */}
      <div className="mt-6 text-sm text-stone-300">
        <span className="font-medium">{dict.cartLabel}</span>{" "}
        {cartLines.length === 0 ? dict.empty : cartLines.join(", ")}
      </div>

      <div className="mt-4 flex items-end gap-4">
        <div className="ml-auto">
          <Button onClick={sendMessage} disabled={isSubmitting}>
            {isSubmitting ? dict.sending : dict.send}
          </Button>
        </div>
      </div>
    </Page.Boundary>
  )
}

function OrderErrorFeedback({ code }: { code?: OrderErrorCode }) {
  const t = useTranslations("OrderErrors")
  return <>{t(code && t.has(code) ? code : "submission_failed")}</>
}

function OrderFeedback({
  code
}: {
  code: "emptyCompany" | "emptyCart" | "submittedToast"
}) {
  const t = useTranslations("Order")
  return <>{t(code)}</>
}
