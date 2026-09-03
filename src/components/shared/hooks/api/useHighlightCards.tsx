import { env } from "@/env"
import { fetchWithTimeout } from "@/lib/api-fetch"
import { useQuery } from "@tanstack/react-query"

export interface HighlightCardData {
  id: number
  title: string
  subtitle: string
  description: string
  brand?: string
  linkText?: string
  linkUrl?: string
  ctaEventName?: string
}

export async function fetchHighlightCards(): Promise<HighlightCardData[]> {
  try {
    const res = await fetchWithTimeout(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/highlightcards`,
      {
        next: { revalidate: 86400, tags: ["highlight-cards"] }
      }
    )
    if (!res.ok) return []
    return res.json() as Promise<HighlightCardData[]>
  } catch {
    return []
  }
}

export function useHighlightCards() {
  return useQuery({
    queryKey: ["highlightcards"],
    queryFn: fetchHighlightCards
  })
}
