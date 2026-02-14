import { env } from "@/env"
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
  const result = await res.json()

  return result as Organization[]
}

export function useOrganization(options?: RequestInit) {
  return useQuery({
    queryKey: ["recruitment"],
    queryFn: () => fetchOrganization(options)
  })
}
