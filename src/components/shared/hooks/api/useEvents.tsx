import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export interface Event {
  id: number
  name: string
  description: string
  location: string
  food: string
  event_start: number
  event_end: number
  event_start_string: string
  registration_end: number
  image_url: string
  fee: number
  registration_required: boolean
  external_event_link: string
  signup_questions: SignupQuestion[]
  signup_link: string
  can_create_teams: boolean
  can_join_teams: boolean
  open_for_signup_student: boolean
  open_for_signup_company: boolean
  event_max_capacity: number
  participant_count: number
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
  const result = await res.json()
  return result as Event[]
}

export function useEvents(options?: RequestInit) {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(options)
  })
}
