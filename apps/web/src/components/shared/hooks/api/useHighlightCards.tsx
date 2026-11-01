import { z } from "zod"
import { readCmsResponse, highlightCardSchema } from "@/lib/cmsResponse"
import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export interface HighlightCardData {
  id: number
  title: string
  titleSv?: string | null
  subtitle: string
  subtitleSv?: string | null
  description: string
  descriptionSv?: string | null
  brand?: string
  linkText?: string
  linkTextSv?: string | null
  linkUrl?: string
  ctaEventName?: string
}

export async function fetchHighlightCards(): Promise<HighlightCardData[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/highlightcards`, {
    next: { revalidate: 86400, tags: ["highlight-cards"] }
  })
  return readCmsResponse<HighlightCardData[]>(
    res,
    "highlight cards",
    z.array(highlightCardSchema)
  )
}

export function useHighlightCards() {
  return useQuery({
    queryKey: ["highlightcards"],
    queryFn: fetchHighlightCards
  })
}
