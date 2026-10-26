import { z } from "zod"
import { readCmsResponse, organizationSchema } from "@/lib/cmsResponse"
import { env } from "@/env"
import { normalizeExternalUrl } from "@/lib/externalUrl"
import { useQuery } from "@tanstack/react-query"

export interface Organization {
  name: string
  nameSv?: string | null
  people: Person[]
}

export interface Person {
  id: number
  name: string
  nameSv?: string | null
  rank?: null | string
  email: null | string
  picture: string
  linkedin_url: null | string
  role: string
  roleSv?: string | null
}

export async function fetchOrganization(options?: RequestInit) {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/organization`, {
    ...options,
    next: { revalidate: 86400, tags: ["organization"], ...options?.next }
  })
  const result = await readCmsResponse<Organization[]>(
    res,
    "organization",
    z.array(organizationSchema)
  )

  return result.map(organization => ({
    ...organization,
    people: organization.people.map(person => ({
      ...person,
      linkedin_url: normalizeExternalUrl(person.linkedin_url)
    }))
  }))
}

export function useOrganization(options?: RequestInit) {
  return useQuery({
    queryKey: ["organization"],
    queryFn: () => fetchOrganization(options)
  })
}
