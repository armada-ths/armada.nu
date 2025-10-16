import { clsx, type ClassValue } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateFormatString(date: DateTime) {
  return `d MMMM ${date.year !== DateTime.now().year ? " YYYY" : ""}`
}

export function formatDate(isoString: string) {
  const date = DateTime.fromISO(isoString)
  return date.toFormat(getDateFormatString(date))
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
