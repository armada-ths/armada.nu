import { z } from "zod"
import { readCmsResponse, eventSchema } from "@/lib/cmsResponse"
import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export interface Event {
  id: number
  name: string
  description: string
  location?: string | null
  food?: string | null
  openTo?: string | null
  mapUrl?: string | null
  eventStart: number | string
  eventEnd: number | string
  eventStartString?: string
  registrationEnd?: number | string
  imageUrl: string
  fee: string
  registrationRequired: boolean
  externalEventLink: string
  signupQuestions: SignupQuestion[]
  signupLink: string
  canCreateTeams: boolean
  canJoinTeams: boolean
  openForSignupStudent: boolean
  openForSignupCompany: boolean
  eventMaxCapacity: number
  participantCount: number
}

export interface SignupQuestion {
  id: number
  type: string
  question: string
  required: boolean
  options: string[]
}

export async function fetchEvents(options?: RequestInit) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/v1/events?public=true`,
    {
      ...options,
      next: { revalidate: 86400, tags: ["events"], ...options?.next }
    }
  )
  return readCmsResponse<Event[]>(res, "events", z.array(eventSchema))
}

export function useEvents(options?: RequestInit) {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(options)
  })
}
