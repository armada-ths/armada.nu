import { env } from "@/env"
import { fetchWithTimeout } from "@/lib/api-fetch"
import { normalizeExternalUrl } from "@/lib/externalUrl"
import { useQuery } from "@tanstack/react-query"

export interface Organization {
  name: string
  people: Person[]
}

export interface Person {
  id: number
  name: string
  rank?: null | string
  email: null | string
  picture: string
  linkedin_url: null | string
  role: string
}

export async function fetchOrganization(options?: RequestInit) {
  try {
    const res = await fetchWithTimeout(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/organization`,
      {
        ...options,
        next: { revalidate: 86400, tags: ["organization"], ...options?.next }
      }
    )
    if (!res.ok) return []
    const result = await res.json()

    return ((result as Organization[] | null) ?? []).map(organization => ({
      ...organization,
      people: organization.people.map(person => ({
        ...person,
        linkedin_url: normalizeExternalUrl(person.linkedin_url)
      }))
    }))
  } catch {
    return []
  }
}

export function useOrganization(options?: RequestInit) {
  return useQuery({
    queryKey: ["recruitment"],
    queryFn: () => fetchOrganization(options)
  })
}
