"use client"
import { sendOrderToSlack } from "@/app/exhibitor/actions"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { Page } from "@/components/shared/Page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "sonner"
import OrderItem from "./_components/OrderItem"

type StoreItem = {
  id: string
  name: string
  description?: string
  max?: number
}

const ITEMS: StoreItem[] = [
  { id: "coffee", name: "Coffee (thermos)", description: "~10 cups", max: 20 },
  { id: "tea", name: "Tea (thermos)", description: "~10 cups", max: 20 },
  { id: "water", name: "Water bottles", description: "50 cl", max: 200 },
  { id: "chips", name: "Potato chips", description: "40 g bags", max: 100 },
  { id: "chocolate", name: "Chocolate bars", description: "Single", max: 200 },
  { id: "fruit", name: "Fruit basket", description: "Assorted", max: 50 }
]

type FormData = {
  company: string
}

export default function OrderPage() {
  const recaptcha = useRef<InstanceType<typeof ReCAPTCHA> | null>(null)
  const [formData, setFormData] = useState<FormData>({ company: "" })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [exhibitors, setExhibitors] = useState<string[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})

  // Support both variable names; prefer SITE_KEY
  const siteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
    process.env.NEXT_PUBLIC_RECAPTCHA_KEY ??
    ""

  useEffect(() => {
    if (!siteKey) {
      // Avoid crashing reCAPTCHA; keep submit disabled
      console.warn(
        "Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY (or NEXT_PUBLIC_RECAPTCHA_KEY). reCAPTCHA disabled."
      )
    }
  }, [siteKey])

  // Fetch exhibitors from API
  useEffect(() => {
    async function loadExhibitors() {
      try {
        const data = await fetchExhibitors()
        if (data) {
          const exhibitorNames = data
            .map(exhibitor => exhibitor.name)
            .sort((a, b) => a.localeCompare(b))
          setExhibitors(exhibitorNames)
        }
      } catch (error) {
        console.error("Error fetching exhibitors:", error)
        toast.error("Failed to load company list")
      }
    }

    loadExhibitors()
  }, [])

  // Cart helpers
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

  const filteredCompanies = formData.company
    ? exhibitors.filter(c =>
        c.toLowerCase().includes(formData.company.toLowerCase())
      )
    : []

  const showCustomOption = formData.company && filteredCompanies.length === 0

  function selectCompany(company: string) {
    setFormData({ company })
    setShowDropdown(false)
  }

  async function sendMessage() {
    if (isSubmitting) return

    if (!formData.company.trim()) {
      toast.warning("Please enter a company name.")
      document.getElementById("company")?.focus()
      return
    }

    if (cartLines.length === 0) {
      toast.warning("Your cart is empty. Please add at least one item.")
      return
    }

    setIsSubmitting(true)

    let token: string | null | undefined
    if (siteKey) {
      try {
        token = await recaptcha.current?.executeAsync()
        if (!token) {
          toast.warning("Please verify the reCAPTCHA!")
          return
        }
      } catch {
        toast.error("Failed to run reCAPTCHA. Please try again.")
        return
      } finally {
        recaptcha.current?.reset()
        setIsSubmitting(false)
      }
    }

    const message = `Order for ${formData.company}:\n${cartLines.map(l => `- ${l}`).join("\n")}`
    const result = await sendOrderToSlack(message, token)

    setIsSubmitting(false)

    if (result.success) {
      setFormData({ company: "" })
      setCart({})
      setSubmitted(true)
      toast.success("Submitted!")
    } else {
      toast.error(result.error ?? "Submit failed!")
    }
  }

  function sendAnother() {
    setSubmitted(false)
    recaptcha.current?.reset()
  }

  if (submitted) {
    return (
      <Page.Background withIndents>
        <Page.Boundary maxWidth={750}>
          <Page.Header>Order</Page.Header>
          <div className="mt-3" role="status" aria-live="polite">
            <h2 className="mb-2 text-lg font-semibold">
              Order submitted successfully!
            </h2>
            <p>We will deliver your order as soon as possible.</p>
            <div className="mt-8">
              <Button size="sm" className="px-2" onClick={sendAnother}>
                New order
              </Button>
            </div>
          </div>
        </Page.Boundary>
      </Page.Background>
    )
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={750}>
        <Page.Header>Order</Page.Header>
        <p className="mt-2 max-w-2xl text-stone-400">
          Here you can order drinks and snacks for your booth during Armada.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {/* Company field (hardcoded combobox) */}
          <fieldset className="flex flex-col">
            <label className="mb-1 text-sm" htmlFor="company">
              Company
            </label>
            <div className="relative">
              <Input
                id="company"
                name="company"
                value={formData.company}
                searchIcon={false}
                onChange={e => {
                  setFormData({ company: e.target.value })
                  setShowDropdown(e.target.value.length > 0)
                }}
                onFocus={() => formData.company && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Select your company"
                autoComplete="off"
                autoFocus
              />
              {showDropdown &&
                (filteredCompanies.length > 0 || showCustomOption) && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-700 bg-zinc-800 shadow-lg">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map(company => (
                        <button
                          key={company}
                          type="button"
                          onClick={() => selectCompany(company)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-700">
                          <Check
                            className={`h-4 w-4 ${
                              formData.company === company
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {company}
                        </button>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => selectCompany(formData.company)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-700">
                        Use &quot;{formData.company}&quot;
                      </button>
                    )}
                  </div>
                )}
            </div>
          </fieldset>

          {/* Store items grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-4 sm:grid-cols-2 md:grid-cols-3">
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
            {siteKey ? (
              <ReCAPTCHA
                ref={recaptcha}
                sitekey={siteKey}
                theme="dark"
                size="invisible"
              />
            ) : (
              <div className="text-sm text-red-600">
                reCAPTCHA unavailable: missing site key
              </div>
            )}
            <div className="ml-auto">
              <Button
                className="mt-0"
                onClick={sendMessage}
                disabled={isSubmitting}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
