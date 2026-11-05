import { env } from "@order/env"
import type { FairDates } from "./orders"
import { z } from "zod"
import { exhibitorSchema, loungeItemSchema, type OrderData } from "./catalogue"

async function fetchValidated<T>(
  path: string,
  schema: z.ZodType<T>
): Promise<T | null> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000)
    })
    if (!response.ok) {
      console.error("Order CMS request failed", {
        path,
        status: response.status
      })
      return null
    }
    const parsed = schema.safeParse(await response.json())
    if (!parsed.success) {
      console.error("Order CMS response is invalid", { path })
      return null
    }
    return parsed.data
  } catch {
    console.error("Order CMS request unavailable", { path })
    return null
  }
}

export async function fetchDates(): Promise<FairDates | null> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/dates`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000)
    })
    return response.ok ? ((await response.json()) as FairDates) : null
  } catch {
    return null
  }
}

export async function fetchOrderData(): Promise<OrderData | null> {
  const filter = encodeURIComponent(JSON.stringify({ tier: "Gold" }))
  const [items, exhibitors] = await Promise.all([
    fetchValidated("lounge-items", z.array(loungeItemSchema)),
    fetchValidated(
      `exhibitors?all=true&filter=${filter}`,
      z.array(exhibitorSchema)
    )
  ])
  if (!items || !exhibitors) return null
  if (
    new Set(items.map(item => item.id)).size !== items.length ||
    new Set(exhibitors.map(item => item.id)).size !== exhibitors.length
  ) {
    console.error("Order CMS response contains duplicate IDs")
    return null
  }
  return {
    items: items.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    exhibitors: exhibitors.sort((a, b) => a.name.localeCompare(b.name))
  }
}
