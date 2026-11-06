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
  orderId?: number
  error?: string
  errorCode?: OrderErrorCode
}
export type OrderInput = {
  idempotencyKey: string
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
