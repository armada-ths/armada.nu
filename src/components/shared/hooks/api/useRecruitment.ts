import { env } from "@/env"
import { fetchWithTimeout } from "@/lib/api-fetch"
import { useQuery } from "@tanstack/react-query"

export interface RecruitmentGroup {
  name: string
  description: string
}

export interface Recruitment {
  name: string
  link: string
  start_date: string
  end_date: string
  groups: Record<string, RecruitmentGroup[]>
}

export async function fetchRecruitment(
  options?: RequestInit
): Promise<Recruitment | null> {
  try {
    const res = await fetchWithTimeout(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/recruitment`,
      {
        ...options,
        next: { revalidate: 86400, tags: ["recruitment"], ...options?.next }
      }
    )

    if (!res.ok) return null

    const result = (await res.json()) as Recruitment | null
    return result
  } catch {
    return null
  }
}

export function useRecruitment(options?: RequestInit) {
  return useQuery({
    queryKey: ["recruitment"],
    queryFn: () => fetchRecruitment(options)
  })
}
