import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"

export interface FairDate {
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

export async function fetchDates(): Promise<FairDate | null> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/dates`, {
    next: {
      revalidate: 60
    }
  })
  if (!res.ok) return null
  return res.json() as Promise<FairDate>
}

export function useDates() {
  return useQuery({
    queryKey: ["dates"],
    queryFn: fetchDates
  })
}

export type ExhibitorSignupPhase =
  | "before-ir"
  | "ir-open"
  | "between"
  | "fr-open"
  | "closed"

export function getExhibitorSignupPhase(dates: FairDate | null): ExhibitorSignupPhase {
  if (!dates) return "closed"
  const zone = "Europe/Stockholm"
  const now = DateTime.now().setZone(zone)
  const irStart = DateTime.fromISO(dates.ir.start, { zone })
  const irEnd = DateTime.fromISO(dates.ir.end, { zone }).endOf("day")
  const frStart = DateTime.fromISO(dates.fr.start, { zone })
  const frEnd = DateTime.fromISO(dates.fr.end, { zone }).endOf("day")

  if (now < irStart) return "before-ir"
  if (now <= irEnd) return "ir-open"
  if (now < frStart) return "between"
  if (now <= frEnd) return "fr-open"
  return "closed"
}

export function isExhibitorSignupOpen(dates: FairDate | null): boolean {
  const phase = getExhibitorSignupPhase(dates)
  return phase === "ir-open" || phase === "fr-open"
}
