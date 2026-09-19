import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export type TimelineEntry = {
  id: number
  title: string
  body: string
  era: string
  eraTitle: string
  sortOrder: number
}

export async function fetchTimelineEntries(): Promise<TimelineEntry[]> {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/v1/timeline-entries`,
    {
      next: { revalidate: 86400, tags: ["timeline-entries"] }
    }
  )
  if (!res.ok) return []
  return res.json() as Promise<TimelineEntry[]>
}

export function useTimelineEntries() {
  return useQuery({
    queryKey: ["timeline-entries"],
    queryFn: fetchTimelineEntries
  })
}
