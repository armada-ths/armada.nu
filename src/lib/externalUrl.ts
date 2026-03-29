const hasUriScheme = (value: string) => /^[a-z][a-z\d+.-]*:/i.test(value)

export const normalizeExternalUrl = (value: unknown): string | null => {
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  if (!trimmed) return null

  const normalized = trimmed.startsWith("//")
    ? `https:${trimmed}`
    : hasUriScheme(trimmed)
      ? trimmed
      : `https://${trimmed}`

  try {
    const parsed = new URL(normalized)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null
    }
    return parsed.toString()
  } catch {
    return null
  }
}
