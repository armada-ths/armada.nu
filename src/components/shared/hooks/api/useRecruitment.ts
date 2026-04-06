import { env } from "@/env"
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
  let res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/v1/recruitment`,
    options ?? {}
  )

  if (!res.ok && res.status === 503) {
    await new Promise(resolve => setTimeout(resolve, 5000))
    res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/recruitment`,
      options ?? {}
    )
  }

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
