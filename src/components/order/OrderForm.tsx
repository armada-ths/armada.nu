"use client"

import { sendOrderToSlack } from "@/app/exhibitor/actions"
import OrderItem from "@/components/order/OrderItem"
import { Page } from "@/components/shared/Page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getLocaleFromPathname, type Locale } from "@/lib/i18n"
import { Check } from "lucide-react"
import { usePathname } from "next/navigation"
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

const orderFormText: Record<
  Locale,
  {
    items: StoreItem[]
    emptyCompany: string
    emptyCart: string
    submittedToast: string
    submitFailed: string
    heading: string
    submittedHeading: string
    submittedBody: string
    newOrder: string
    intro: string
    companyLabel: string
    companyPlaceholder: string
    useCustomCompany: (company: string) => string
    cartLabel: string
    empty: string
    send: string
    controls: { decrease: string; quantity: string; increase: string }
  }
> = {
  en: {
    items: [
      {
        id: "sandwich-turkey",
        name: "Sandwich (Turkey)",
        description: "Freshly made with turkey and vegetables"
      },
      {
        id: "sandwich-vegetarian",
        name: "Sandwich (Vegetarian)",
        description: "Freshly made with cheese and vegetables"
      },
      {
        id: "pain-au-chocolat",
        name: "Pain au Chocolat",
        description: "Butter pastry with chocolate"
      },
      {
        id: "cinnamon-bun",
        name: "Cinnamon bun",
        description: "Classic Swedish Kanelbulle"
      },
      {
        id: "muffin-chocolate",
        name: "Muffin (Chocolate)",
        description: "Soft and rich"
      },
      {
        id: "muffin-blueberry",
        name: "Muffin (Blueberry)",
        description: "Sweet and fruity"
      },
      {
        id: "apple-cake-vegan",
        name: "Apple Cake (Vegan)",
        description: "Plant-based apple cake"
      },
      {
        id: "chocolate-balls-vegan",
        name: "Chocolate ball (Vegan)",
        description: "Classic Swedish Chokladboll"
      },
      { id: "coffee", name: "Black Coffee", description: "Sugar on the side" },
      {
        id: "coffee-with-milk",
        name: "Coffee with Oat milk",
        description: "Sugar on the side"
      },
      { id: "tea", name: "Tea", description: "Sugar on the side" },
      {
        id: "hot-chocolate",
        name: "Oboy",
        description: "Warm and Sweet Cocoa drink"
      }
    ],
    emptyCompany: "Please enter a company name.",
    emptyCart: "Your cart is empty.",
    submittedToast: "Submitted!",
    submitFailed: "Submit failed!",
    heading: "Order",
    submittedHeading: "Order submitted!",
    submittedBody: "We'll deliver your order as soon as possible.",
    newOrder: "New order",
    intro:
      "Here you can order drinks and snacks for your booth during Armada.\n\nUse this form for delivery straight to your booth - or feel free to drop by the lounge for a friendly chat and a fresh cup of coffee. (If you have any questions about ingredients or allergies, please come by the lounge and we'll be happy to help.)",
    companyLabel: "Company",
    companyPlaceholder: "Select your company",
    useCustomCompany: company => `Use "${company}"`,
    cartLabel: "Cart:",
    empty: "(empty)",
    send: "Send",
    controls: {
      decrease: "Decrease",
      quantity: "Quantity",
      increase: "Increase"
    }
  },
  sv: {
    items: [
      {
        id: "sandwich-turkey",
        name: "Smörgås (kalkon)",
        description: "Nybredd med kalkon och grönsaker"
      },
      {
        id: "sandwich-vegetarian",
        name: "Smörgås (vegetarisk)",
        description: "Nybredd med ost och grönsaker"
      },
      {
        id: "pain-au-chocolat",
        name: "Pain au chocolat",
        description: "Smördeg med choklad"
      },
      {
        id: "cinnamon-bun",
        name: "Kanelbulle",
        description: "Klassisk svensk kanelbulle"
      },
      {
        id: "muffin-chocolate",
        name: "Muffin (choklad)",
        description: "Mjuk och fyllig"
      },
      {
        id: "muffin-blueberry",
        name: "Muffin (blåbär)",
        description: "Söt och fruktig"
      },
      {
        id: "apple-cake-vegan",
        name: "Äppelkaka (vegansk)",
        description: "Växtbaserad äppelkaka"
      },
      {
        id: "chocolate-balls-vegan",
        name: "Chokladboll (vegansk)",
        description: "Klassisk svensk chokladboll"
      },
      { id: "coffee", name: "Svart kaffe", description: "Socker vid sidan av" },
      {
        id: "coffee-with-milk",
        name: "Kaffe med havremjölk",
        description: "Socker vid sidan av"
      },
      { id: "tea", name: "Te", description: "Socker vid sidan av" },
      {
        id: "hot-chocolate",
        name: "Oboy",
        description: "Varm och söt kakaodryck"
      }
    ],
    emptyCompany: "Ange ett företagsnamn.",
    emptyCart: "Varukorgen är tom.",
    submittedToast: "Skickat!",
    submitFailed: "Det gick inte att skicka!",
    heading: "Beställning",
    submittedHeading: "Beställningen är skickad!",
    submittedBody: "Vi levererar er beställning så snart som möjligt.",
    newOrder: "Ny beställning",
    intro:
      "Här kan ni beställa dryck och snacks till er monter under Armada.\n\nAnvänd formuläret för leverans direkt till montern - eller kom gärna förbi loungen för ett trevligt samtal och en ny kopp kaffe. Om ni har frågor om ingredienser eller allergier är ni välkomna förbi loungen så hjälper vi gärna till.",
    companyLabel: "Företag",
    companyPlaceholder: "Välj ert företag",
    useCustomCompany: company => `Använd "${company}"`,
    cartLabel: "Varukorg:",
    empty: "(tom)",
    send: "Skicka",
    controls: { decrease: "Minska", quantity: "Antal", increase: "Öka" }
  }
}

export function OrderForm({ exhibitors }: OrderFormProps) {
  const locale = getLocaleFromPathname(usePathname())
  const dict = orderFormText[locale]
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
    const item = dict.items.find(i => i.id === id)
    return item ? `${item.name} x${qty}` : `${id} x${qty}`
  })

  async function sendMessage() {
    if (isSubmitting) return

    if (!company.trim()) {
      toast.warning(dict.emptyCompany)
      return
    }

    if (cartLines.length === 0) {
      toast.warning(dict.emptyCart)
      return
    }

    setIsSubmitting(true)

    const message = `Order for ${company}:\n${cartLines.map(l => `- ${l}`).join("\n")}`
    try {
      const result = await sendOrderToSlack(message)
      console.log("Result:", result)
      setIsSubmitting(false)

      if (result.success) {
        toast.success(dict.submittedToast)
        setSubmitted(true)
        setCompany("")
        setCart({})
      } else {
        toast.error(result.error ?? dict.submitFailed)
      }
    } catch (err) {
      console.error(err)
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
                    {dict.useCustomCompany(company)}
                  </button>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {dict.items.map(item => (
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
            {dict.send}
          </Button>
        </div>
      </div>
    </Page.Boundary>
  )
}
