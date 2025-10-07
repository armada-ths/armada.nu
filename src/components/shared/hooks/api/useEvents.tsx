import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export interface Event {
  id: number
  name: string
  description: string
  location: string
  food: string
  eventStart: number | string
  eventEnd: number | string
  eventStartString?: string
  registrationEnd?: number | string
  imageUrl: string
  fee: number
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
    `${env.NEXT_PUBLIC_API_URL}/api/v1/events`,
    options ?? {}
  )
  try {
    const result = await res.json()
    return result as Event[]
  } catch (error) {
    console.error(
      `Unable to fetch events. Error: ${(error as Error)?.message || error}`
    )
  }
  return []
}

export function useEvents(options?: RequestInit) {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(options)
  })
}
