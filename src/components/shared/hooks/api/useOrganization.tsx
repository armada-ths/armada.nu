import { env } from "@/env"
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
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/v1/organization`,
    options ?? {}
  )
  if (!res.ok) {
    throw new Error(`Failed to fetch organization: ${res.status}`)
  }
  const result = await res.json()

  return ((result as Organization[] | null) ?? []).map(organization => ({
    ...organization,
    people: organization.people.map(person => ({
      ...person,
      linkedin_url: normalizeExternalUrl(person.linkedin_url)
    }))
  }))
}

export function useOrganization(options?: RequestInit) {
  return useQuery({
    queryKey: ["recruitment"],
    queryFn: () => fetchOrganization(options)
  })
}
