type TelemetryEvent = { url: string; route?: string }

export function redactAppTelemetry<T extends TelemetryEvent>(
  event: T,
  app: "photos" | "order"
): T | null {
  try {
    const url = new URL(event.url)
    const mask = (path: string) =>
      app === "photos" ? path.replace(/^(\/e\/)[^/]+/, "$1:redacted") : path
    url.pathname = mask(url.pathname)
    url.search = ""
    url.hash = ""
    return {
      ...event,
      url: url.toString(),
      ...(event.route ? { route: mask(event.route.split(/[?#]/)[0]) } : {})
    }
  } catch {
    return null
  }
}
