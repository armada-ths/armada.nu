import { env } from "@order/env"
import type { FairDates } from "./orders"
import { z } from "zod"
import {
  exhibitorSchema,
  loungeItemSchema,
  loungeCategorySchema,
  type OrderData
} from "./catalogue"

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
        status: response.status,
        url: response.url
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
  return fetchValidated(
    "dates",
    z.object({ fair: z.object({ days: z.array(z.string()).min(2) }) })
  )
}

export async function fetchOrderData(): Promise<OrderData | null> {
  const filter = encodeURIComponent(JSON.stringify({ tier: "Gold" }))
  const [catalogue, exhibitors] = await Promise.all([
    fetchValidated(
      "lounge-catalogue",
      z.object({
        revision: z.number().int().nonnegative().safe(),
        items: z.array(loungeItemSchema),
        categories: z.array(loungeCategorySchema)
      })
    ),
    fetchValidated(
      `exhibitors?all=true&filter=${filter}`,
      z.array(exhibitorSchema)
    )
  ])
  if (!catalogue || !exhibitors) return null
  const { items, categories } = catalogue
  if (
    new Set(items.map(item => item.id)).size !== items.length ||
    new Set(exhibitors.map(item => item.id)).size !== exhibitors.length ||
    new Set(categories.map(category => category.id)).size !== categories.length
  ) {
    console.error("Order CMS response contains duplicate IDs")
    return null
  }
  const categoryIds = new Set(categories.map(category => category.id))
  if (items.some(item => !categoryIds.has(item.categoryId))) {
    console.error("Order CMS response contains an unknown category")
    return null
  }
  return {
    categories: categories.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.id - b.id
    ),
    items: items.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    exhibitors: exhibitors.sort((a, b) => a.name.localeCompare(b.name))
  }
}
