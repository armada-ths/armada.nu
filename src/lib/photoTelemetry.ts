type TelemetryEvent = { url: string; route?: string }

const photoPath = /^\/photos(?:\/|$)/
const eventPath = /^(\/(?:photos\/)?e\/)[^/]+(?=\/|$)/

export function redactPhotoTelemetryEvent<T extends TelemetryEvent>(
  event: T
): T | null {
  let url: URL
  try {
    url = new URL(event.url)
  } catch {
    return null
  }

  if (url.hostname !== "photos.armada.nu" && !photoPath.test(url.pathname)) {
    return event
  }

  url.pathname = url.pathname.replace(eventPath, "$1:redacted")
  url.search = ""
  url.hash = ""

  return {
    ...event,
    url: url.toString(),
    ...(event.route && {
      route: event.route.replace(eventPath, "$1:redacted")
    })
  }
}
