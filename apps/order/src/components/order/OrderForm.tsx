"use client"
import { useLocale, useTranslations, useFormatter } from "next-intl"
import { useDraftState } from "@armada/shared/i18n/client"
import { localizedText, normalizeLocale } from "@armada/shared/i18n/routing"
import OrderItem from "./OrderItem"
import { Page } from "@armada/shared/Page"
import { Button } from "@armada/shared/ui/button"
import { Card } from "@armada/shared/ui/card"
import { Input } from "@armada/shared/ui/input"
import { Check } from "lucide-react"
import {
  startTransition,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState
} from "react"
import { toast } from "sonner"
import type { LoungeItem, OrderData } from "@order/lib/catalogue"
import type {
  OrderInput,
  OrderResult,
  OrderErrorCode,
  OrderDataResult
} from "@order/lib/orders"

type OrderFormProps = {
  data: OrderData
  refreshData: () => Promise<OrderDataResult>
  submitOrder: (input: OrderInput) => Promise<OrderResult>
}

export function OrderForm({
  data: initialData,
  refreshData,
  submitOrder
}: OrderFormProps) {
  const format = useFormatter()
  const locale = normalizeLocale(useLocale())
  const t = useTranslations("Order")
  const errors = useTranslations("OrderErrors")
  const [data, setData] = useState(initialData)
  const [refreshError, setRefreshError] = useState<OrderErrorCode>()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshLock = useRef(false)
  const mounted = useRef(true)
  const submissionLock = useRef(false)
  const [company, setCompany] = useDraftState("company", "")
  const [exhibitorId, setExhibitorId] = useDraftState<number | null>(
    "exhibitorId",
    null
  )
  const [cart, setCart] = useDraftState<Record<string, number>>("cart", {})
  const [cartItems, setCartItems] = useDraftState<Record<string, LoungeItem>>(
    "cartItems",
    {}
  )
  const [submitted, setSubmitted] = useDraftState("submitted", false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeOption, setActiveOption] = useState(-1)
  const listId = useId()
  const filteredCompanies = data.exhibitors.filter(item =>
    item.name.toLowerCase().includes(company.toLowerCase())
  )
  const selectedCompany = data.exhibitors.find(item => item.id === exhibitorId)

  const reload = useCallback(async () => {
    if (refreshLock.current) return
    refreshLock.current = true
    if (mounted.current) setIsRefreshing(true)
    try {
      const result = await refreshData()
      if (!mounted.current) return
      if (result.success) {
        setData(result.data)
        setRefreshError(undefined)
      } else {
        setRefreshError(result.errorCode)
      }
    } catch {
      if (mounted.current) setRefreshError("availability_unavailable")
    } finally {
      refreshLock.current = false
      if (mounted.current) setIsRefreshing(false)
    }
  }, [refreshData])

  useEffect(() => {
    mounted.current = true
    const refresh = () => {
      if (document.visibilityState === "visible")
        startTransition(() => {
          void reload()
        })
    }
    const timer = window.setInterval(refresh, 30000)
    window.addEventListener("focus", refresh)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      mounted.current = false
      window.clearInterval(timer)
      window.removeEventListener("focus", refresh)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [reload])

  const lines = Object.entries(cart).map(([id, quantity]) => {
    const current = data.items.find(item => String(item.id) === id)
    const item = current ?? cartItems[id]
    const invalid =
      !current ||
      current.soldOut ||
      (current.maxPerOrder != null && quantity > current.maxPerOrder)
    return { id, quantity, item, invalid, current }
  })
  const invalidCart = lines.some(line => line.invalid)
  const blocked = Boolean(refreshError) || isRefreshing || isSubmitting
  const nameOf = (item: LoungeItem) =>
    localizedText(locale, item.name, item.nameSv)

  function updateCart(item: LoungeItem, quantity: number) {
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      toast.warning(<OrderErrorFeedback code="invalid_order" />)
      return
    }
    const id = String(item.id)
    setCartItems(previous => ({ ...previous, [id]: item }))
    setCart(previous => {
      const next = { ...previous }
      if (quantity === 0) delete next[id]
      else next[id] = quantity
      return next
    })
  }

  function removeLine(id: string) {
    setCart(previous => {
      const next = { ...previous }
      delete next[id]
      return next
    })
  }

  function selectCompany(id: number, name: string) {
    setExhibitorId(id)
    setCompany(name)
    setShowDropdown(false)
    setActiveOption(-1)
  }

  async function sendMessage() {
    if (submissionLock.current || blocked) return
    if (!selectedCompany) {
      toast.warning(<OrderFeedback code="emptyCompany" />)
      return
    }
    if (lines.length === 0) {
      toast.warning(<OrderFeedback code="emptyCart" />)
      return
    }
    if (invalidCart) {
      toast.warning(<OrderErrorFeedback code="items_changed" />)
      return
    }
    submissionLock.current = true
    setIsSubmitting(true)
    try {
      const result = await submitOrder({
        exhibitorId: selectedCompany.id,
        items: lines.map(({ id, quantity }) => ({ id, quantity }))
      })
      if (result.success) {
        toast.success(<OrderFeedback code="submittedToast" />)
        setSubmitted(true)
        setCompany("")
        setExhibitorId(null)
        setCart({})
        setCartItems({})
      } else {
        toast.error(
          <OrderErrorFeedback code={result.errorCode ?? "submission_failed"} />
        )
        startTransition(() => {
          void reload()
        })
      }
    } catch {
      toast.error(<OrderErrorFeedback code="submission_failed" />)
    } finally {
      submissionLock.current = false
      setIsSubmitting(false)
    }
  }

  if (submitted)
    return (
      <Page.Boundary maxWidth={750}>
        <Page.Header>{t("heading")}</Page.Header>
        <div className="mt-3">
          <h2 className="mb-2 text-lg font-semibold">
            {t("submittedHeading")}
          </h2>
          <p>{t("submittedBody")}</p>
          <Button
            size="sm"
            className="mt-6"
            onClick={() => setSubmitted(false)}>
            {t("newOrder")}
          </Button>
        </div>
      </Page.Boundary>
    )

  return (
    <Page.Boundary maxWidth={750}>
      <Page.Header>{t("heading")}</Page.Header>
      <p className="text-licorice mt-2 whitespace-pre-line">{t("intro")}</p>
      {refreshError && (
        <div role="alert" className="mt-4 rounded-md border p-3">
          <p>{errors(refreshError)}</p>
          <Button
            className="mt-2"
            disabled={isRefreshing}
            onClick={() =>
              startTransition(() => {
                void reload()
              })
            }>
            {t("retry")}
          </Button>
        </div>
      )}
      <div className="mt-6">
        <label className="mb-1 text-sm" htmlFor="company">
          {t("companyLabel")}
        </label>
        <div className="relative">
          <Input
            id="company"
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={listId}
            aria-activedescendant={
              showDropdown &&
              activeOption >= 0 &&
              filteredCompanies[activeOption]
                ? `${listId}-${filteredCompanies[activeOption].id}`
                : undefined
            }
            value={company}
            onChange={event => {
              setCompany(event.target.value)
              setExhibitorId(null)
              setActiveOption(-1)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setShowDropdown(false)}
            onKeyDown={event => {
              if (event.key === "Escape") setShowDropdown(false)
              else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault()
                setShowDropdown(true)
                const delta = event.key === "ArrowDown" ? 1 : -1
                setActiveOption(previous =>
                  Math.max(
                    0,
                    Math.min(filteredCompanies.length - 1, previous + delta)
                  )
                )
              } else if (event.key === "Enter" && showDropdown) {
                event.preventDefault()
                const choice = filteredCompanies[activeOption]
                if (choice) selectCompany(choice.id, choice.name)
              }
            }}
            placeholder={t("companyPlaceholder")}
          />
          {showDropdown && (
            <div
              id={listId}
              role="listbox"
              aria-label={t("companyLabel")}
              className="border-licorice bg-licorice text-snow absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-lg">
              {filteredCompanies.map((item, index) => (
                <div
                  id={`${listId}-${item.id}`}
                  key={item.id}
                  role="option"
                  aria-selected={exhibitorId === item.id}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-left hover:bg-zinc-700 ${activeOption === index ? "outline-snow bg-zinc-700 outline-2 -outline-offset-2" : ""}`}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => selectCompany(item.id, item.name)}>
                  <Check
                    className={`h-4 w-4 ${exhibitorId === item.id ? "opacity-100" : "opacity-0"}`}
                  />
                  {item.name}
                </div>
              ))}
              {filteredCompanies.length === 0 && (
                <p className="px-3 py-2">{t("noCompanies")}</p>
              )}
            </div>
          )}
        </div>
        {company && !selectedCompany && (
          <p role="status" className="mt-2 text-sm">
            {t("selectGoldCompany")}
          </p>
        )}
        {!data.exhibitors.length && <p className="mt-2">{t("noCompanies")}</p>}
      </div>
      {!data.items.length && (
        <p role="status" className="mt-8">
          {t("emptyCatalogue")}
        </p>
      )}
      {data.items.length > 0 && data.items.every(item => item.soldOut) && (
        <p role="status" className="mt-8">
          {t("allSoldOut")}
        </p>
      )}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.items.map(item => (
          <Card key={item.id} className="bg-snow text-licorice p-4">
            <OrderItem
              name={nameOf(item)}
              description={
                localizedText(locale, item.description, item.descriptionSv) ??
                undefined
              }
              imageUrl={item.imageUrl ?? undefined}
              max={item.maxPerOrder ?? undefined}
              unavailable={item.soldOut || blocked}
              soldOutLabel={item.soldOut ? t("soldOut") : undefined}
              quantity={cart[String(item.id)] ?? 0}
              onIncrease={() =>
                updateCart(item, (cart[String(item.id)] ?? 0) + 1)
              }
              onDecrease={() =>
                updateCart(item, Math.max(0, (cart[String(item.id)] ?? 0) - 1))
              }
              onChange={quantity => updateCart(item, quantity)}
              labels={{
                decrease: t("controls.decrease"),
                quantity: t("controls.quantity"),
                increase: t("controls.increase")
              }}
            />
          </Card>
        ))}
      </div>
      <section
        className="text-licorice mt-6 text-sm"
        aria-label={t("cartLabel")}>
        <h2 className="font-medium">{t("cartLabel")}</h2>
        {!lines.length ? (
          <p>{t("empty")}</p>
        ) : (
          <ul className="space-y-2">
            {lines.map(line => (
              <li key={line.id} className="flex flex-wrap items-center gap-2">
                <span>
                  {line.item ? nameOf(line.item) : t("removedItem")} ×{" "}
                  {format.number(line.quantity)}
                </span>
                {line.invalid && (
                  <span role="status">
                    {!line.current
                      ? t("removedItem")
                      : line.current.soldOut
                        ? t("soldOut")
                        : t("limitChanged")}
                  </span>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="neutral"
                  disabled={isSubmitting}
                  onClick={() => removeLine(line.id)}
                  aria-label={t("removeItem", {
                    name: line.item ? nameOf(line.item) : t("removedItem")
                  })}>
                  {t("remove")}
                </Button>
              </li>
            ))}
          </ul>
        )}
        {invalidCart && (
          <p role="alert" className="mt-2">
            {t("invalidCart")}
          </p>
        )}
      </section>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={sendMessage}
          disabled={
            blocked || invalidCart || !selectedCompany || !lines.length
          }>
          {isSubmitting ? t("sending") : t("send")}
        </Button>
      </div>
    </Page.Boundary>
  )
}

function OrderFeedback({
  code
}: {
  code: "emptyCompany" | "emptyCart" | "submittedToast"
}) {
  const t = useTranslations("Order")
  return <>{t(code)}</>
}

function OrderErrorFeedback({ code }: { code: OrderErrorCode }) {
  const t = useTranslations("OrderErrors")
  return <>{t(code)}</>
}
