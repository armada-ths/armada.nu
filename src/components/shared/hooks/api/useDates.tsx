import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

interface FairDate {
  fair: {
    description: string
    days: string[]
  }
  ticket: {
    end: string | null
  }
  ir: {
    start: string
    end: string
    acceptance: string
  }
  fr: {
    start: string
    end: string
  }
  events: {
    start: string
    end: string
  }
}

export async function fetchDates() {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/dates`)
  const result = await res.json()
  return result as FairDate
}

export function useDates() {
  return useQuery({
    queryKey: ["dates"],
    queryFn: fetchDates
  })
}
