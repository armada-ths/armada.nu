import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export interface RecruitmentGroup {
  name: string
  nameSv?: string | null
  description: string
  descriptionSv?: string | null
}

export interface Recruitment {
  name: string
  nameSv?: string | null
  link: string
  start_date: string
  end_date: string
  groupNamesSv?: Record<string, string>
  groups: Record<string, RecruitmentGroup[]>
}

export async function fetchRecruitment(
  options?: RequestInit
): Promise<Recruitment | null> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/recruitment`, {
    ...options,
    next: { revalidate: 86400, tags: ["recruitment"], ...options?.next }
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch recruitment: ${res.status} ${res.statusText}`
    )
  }

  const result = (await res.json()) as Recruitment | null
  return result
}

export function useRecruitment(options?: RequestInit) {
  return useQuery({
    queryKey: ["recruitment"],
    queryFn: () => fetchRecruitment(options)
  })
}
