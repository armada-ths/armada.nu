import { DateTime } from "luxon"
import { z } from "zod"
import type { OrderData } from "./catalogue"

export type OrderErrorCode =
  | "access_required"
  | "orders_closed"
  | "invalid_order"
  | "availability_unavailable"
  | "delivery_unavailable"
  | "delivery_failed"
  | "submission_failed"
  | "company_ineligible"
  | "items_changed"
export type OrderResult = {
  success: boolean
  error?: string
  errorCode?: OrderErrorCode
}
export type OrderInput = {
  exhibitorId: number
  items: { id: string; quantity: number }[]
}
export type OrderDataResult =
  | { success: true; data: OrderData }
  | { success: false; errorCode: OrderErrorCode }
export type FairDates = { fair: { days: string[] } }

export function hasOrderAccess(
  cookie: string | undefined,
  secret: string | undefined
) {
  return Boolean(secret?.trim() && cookie === secret)
}

export function isOrderOpen(dates: unknown, now: DateTime = DateTime.now()) {
  const parsed = z
    .object({ fair: z.object({ days: z.array(z.string()).min(2) }) })
    .safeParse(dates)
  if (!parsed.success) return false
  const zone = "Europe/Stockholm"
  const first = DateTime.fromISO(parsed.data.fair.days[0], {
    zone
  }).startOf("day")
  const second = DateTime.fromISO(parsed.data.fair.days[1], {
    zone
  }).startOf("day")
  const localNow = now.setZone(zone)
  if (!first.isValid || !second.isValid || second <= first || !localNow.isValid)
    return false
  if (localNow < first) return true
  if (localNow.hasSame(first, "day"))
    return localNow <= first.set({ hour: 15, minute: 30 })
  if (localNow.hasSame(second, "day"))
    return (
      localNow >= second.set({ hour: 10 }) &&
      localNow <= second.set({ hour: 14, minute: 30 })
    )
  return false
}

const schema = z.object({
  exhibitorId: z.number().int().positive().safe(),
  items: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().int().positive().safe()
      })
    )
    .min(1)
})

export function validateOrder(
  input: unknown,
  data: OrderData
):
  | { success: true; message: string }
  | { success: false; errorCode: OrderErrorCode } {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { success: false, errorCode: "invalid_order" }
  const exhibitor = data.exhibitors.find(
    item => item.id === parsed.data.exhibitorId
  )
  if (!exhibitor || exhibitor.tier !== "Gold")
    return { success: false, errorCode: "company_ineligible" }
  const seen = new Set<string>()
  const lines: string[] = []
  for (const line of parsed.data.items) {
    const item = data.items.find(item => String(item.id) === line.id)
    if (
      !item ||
      item.soldOut ||
      seen.has(line.id) ||
      (item.maxPerOrder != null && line.quantity > item.maxPerOrder)
    )
      return { success: false, errorCode: "items_changed" }
    seen.add(line.id)
    lines.push(`- ${item.name} x${line.quantity}`)
  }
  return {
    success: true,
    message: `Order for ${exhibitor.name}:\n${lines.join("\n")}`
  }
}
