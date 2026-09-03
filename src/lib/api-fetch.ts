const defaultTimeoutMs = process.env.NODE_ENV === "development" ? 3000 : 10000

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = defaultTimeoutMs
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    })
  } finally {
    clearTimeout(timeout)
  }
}
