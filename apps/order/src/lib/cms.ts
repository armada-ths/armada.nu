import { env } from "@order/env"
import type { FairDates } from "./orders"

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

export async function fetchExhibitors(): Promise<string[]> {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/exhibitors`,
      { cache: "no-store", signal: AbortSignal.timeout(10000) }
    )
    if (!response.ok) return []
    const data: { name: string }[] = await response.json()
    return data.map(item => item.name).sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}
