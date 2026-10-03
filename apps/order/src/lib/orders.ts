import { DateTime } from "luxon"
import { z } from "zod"
import { ITEMS } from "./catalogue"

export type OrderResult = { success: boolean; error?: string }
export type OrderInput = {
  company: string
  items: { id: string; quantity: number }[]
}
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
  company: z.string().trim().min(1),
  items: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().int().positive().safe()
      })
    )
    .min(1)
})

export function formatOrder(input: unknown): string | null {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return null
  const seen = new Set<string>()
  const lines: string[] = []
  for (const line of parsed.data.items) {
    const item = ITEMS.find(item => item.id === line.id)
    if (
      !item ||
      seen.has(line.id) ||
      (item.max !== undefined && line.quantity > item.max)
    )
      return null
    seen.add(line.id)
    lines.push(`- ${item.name} x${line.quantity}`)
  }
  return `Order for ${parsed.data.company}:\n${lines.join("\n")}`
}
