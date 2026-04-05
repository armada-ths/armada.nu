import { clsx, type ClassValue } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shouldBypassNextImageOptimization(src?: null | string) {
  if (!src) return false

  return (
    src.startsWith("http://localhost:9000/") ||
    src.startsWith("http://127.0.0.1:9000/")
  )
}

export function getDateFormatString(date: DateTime) {
  return `d MMMM ${date.year !== DateTime.now().year ? " yyyy" : ""}`
}

export function formatDate(isoString: string) {
  const date = DateTime.fromISO(isoString)
  return date.toFormat(getDateFormatString(date))
}

function getOrdinalSuffix(day: number) {
  if (day % 10 === 1 && day % 100 !== 11) return "st"
  if (day % 10 === 2 && day % 100 !== 12) return "nd"
  if (day % 10 === 3 && day % 100 !== 13) return "rd"
  return "th"
}

export function formatHumanDate(isoString: string) {
  const date = DateTime.fromISO(isoString)
  const day = date.day
  return `${day}${getOrdinalSuffix(day)} of ${date.toFormat("MMMM")}${date.year !== DateTime.now().year ? ` ${date.year}` : ""
    }`
}

const EVENT_TIME_ZONE = "Europe/Stockholm"

type EventDateInput = number | string | null | undefined

function parseEventDate(input: EventDateInput) {
  if (input == null) return null

  if (typeof input === "number") {
    const date = DateTime.fromSeconds(input, { zone: "UTC" }).setZone(
      EVENT_TIME_ZONE
    )
    return date.isValid ? date : null
  }

  const iso = DateTime.fromISO(input, { zone: EVENT_TIME_ZONE })
  if (iso.isValid) return iso

  const fallback = DateTime.fromFormat(input, "yyyy-MM-dd'T'HH:mm", {
    zone: EVENT_TIME_ZONE
  })
  return fallback.isValid ? fallback : null
}

export function formatTimestampAsDate(
  input: EventDateInput,
  fallback = "Date TBA"
) {
  const date = parseEventDate(input)
  if (!date) return fallback
  return date.toFormat(getDateFormatString(date))
}

export function formatTimestampAsTime(
  input: EventDateInput,
  fallback = "--:--"
) {
  const date = parseEventDate(input)
  if (!date) return fallback
  return date.toFormat("HH:mm")
}

export function eventDateTimeToEpochSeconds(input: EventDateInput) {
  const date = parseEventDate(input)
  return date ? Math.floor(date.toSeconds()) : null
}
