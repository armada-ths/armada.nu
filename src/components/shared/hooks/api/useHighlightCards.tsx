import { env } from "@/env"
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
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/highlightcards`, {
        next: { revalidate: 60 } // 60 seconds – reflect CMS updates quickly
    })
    if (!res.ok) return []
    return res.json() as Promise<HighlightCardData[]>
}

export function useHighlightCards() {
    return useQuery({
        queryKey: ["highlightcards"],
        queryFn: fetchHighlightCards
    })
}
