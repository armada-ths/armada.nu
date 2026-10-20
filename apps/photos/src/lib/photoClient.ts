export function createPhotoID() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID()

  // HTTP LAN origins do not expose randomUUID, but do expose getRandomValues.
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, byte =>
    byte.toString(16).padStart(2, "0")
  ).join("")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function photoStorageURL(url: string, localDevelopment: boolean) {
  if (!localDevelopment) return url
  const parsed = new URL(url, "http://localhost")
  if (
    parsed.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(parsed.hostname) &&
    parsed.port === "54321"
  ) {
    return `/local-photo-storage${parsed.pathname}${parsed.search}`
  }
  return url
}
