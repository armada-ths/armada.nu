import { normalizeExternalUrl } from "./externalUrl"

function mapLink(value: unknown): URL | null {
  const normalized = normalizeExternalUrl(value)
  if (!normalized) return null
  const url = new URL(normalized)
  if (url.protocol !== "https:" || url.port || url.username || url.password)
    return null
  return url
}

export function isShortMapLink(value: unknown): boolean {
  const url = mapLink(value)
  return (
    !!url &&
    (url.hostname === "maps.app.goo.gl" ||
      (url.hostname === "goo.gl" && url.pathname.startsWith("/maps/")))
  )
}

function isGoogleMap(url: URL): boolean {
  return (
    [
      "www.google.com",
      "google.com",
      "maps.google.com",
      "www.google.se",
      "google.se",
      "maps.google.se"
    ].includes(url.hostname) &&
    (url.pathname.startsWith("/maps") || url.hostname.startsWith("maps."))
  )
}

function coordinates(
  lat: string | null | undefined,
  lon: string | null | undefined
): string | null {
  if (!lat?.trim() || !lon?.trim()) return null
  const latitude = Number(lat),
    longitude = Number(lon)
  return Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
    ? `${latitude},${longitude}`
    : null
}

// Never embed a CMS URL directly: only construct Google Maps URLs.
export function eventMapEmbedUrl(
  value: unknown,
  apiKey: string
): string | null {
  if (!apiKey.trim()) return null
  const url = mapLink(value)
  if (!url) return null
  if (!isGoogleMap(url)) return null
  let path: string
  try {
    path = decodeURIComponent(url.pathname)
  } catch {
    return null
  }
  // Google's place coordinates are more precise than the @ viewport centre.
  const pin = path.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
  const point = coordinates(pin?.[1], pin?.[2])
  const place = path.match(/\/place\/([^/]+)/)?.[1]?.replace(/\+/g, " ")
  const query =
    point || url.searchParams.get("query") || url.searchParams.get("q") || place
  if (!query?.trim() || query.length > 500) return null
  return `https://www.google.com/maps/embed/v1/place?${new URLSearchParams({ key: apiKey, q: query })}`
}

// Resolve only known Google map redirects; never fetch arbitrary user URLs.
export async function resolveEventMap(
  value: string,
  apiKey: string,
  fetcher: typeof fetch = fetch
): Promise<string | null> {
  if (!apiKey.trim()) return null
  if (!isShortMapLink(value)) return eventMapEmbedUrl(value, apiKey)
  let current = value
  const signal = AbortSignal.timeout(8000)
  for (let i = 0; i < 4; i++) {
    const url = mapLink(current)
    if (!url || (!isShortMapLink(current) && !isGoogleMap(url))) return null
    const embed = eventMapEmbedUrl(current, apiKey)
    if (embed) return embed
    const response = await fetcher(url.toString(), {
      redirect: "manual",
      signal,
      next: { revalidate: 86400 }
    })
    await response.body?.cancel()
    const location = response.headers.get("location")
    if (response.status < 300 || response.status >= 400 || !location)
      return null
    current = new URL(location, url).toString()
  }
  return eventMapEmbedUrl(current, apiKey)
}
