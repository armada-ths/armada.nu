import { redactPhotoTelemetryEvent } from "./photoTelemetry"
import { describe, expect, it } from "vitest"

describe("redactPhotoTelemetryEvent", () => {
  it("masks an event token on the photo subdomain", () => {
    expect(
      redactPhotoTelemetryEvent({
        type: "pageview",
        url: "https://photos.armada.nu/e/secret-token?guest_id=private",
        route: "/e/secret-token"
      })
    ).toEqual({
      type: "pageview",
      url: "https://photos.armada.nu/e/:redacted",
      route: "/e/:redacted"
    })
  })

  it("masks the internal photos route and removes its query string", () => {
    expect(
      redactPhotoTelemetryEvent({
        url: "https://armada.nu/photos/e/secret-token?source=qr",
        route: "/photos/e/[token]"
      })
    ).toEqual({
      url: "https://armada.nu/photos/e/:redacted",
      route: "/photos/e/:redacted"
    })
  })

  it("removes query strings from other photo pages", () => {
    expect(
      redactPhotoTelemetryEvent({
        url: "https://photos.armada.nu/privacy?token=secret"
      })
    ).toEqual({ url: "https://photos.armada.nu/privacy" })
  })

  it("leaves unrelated page views unchanged", () => {
    const event = { url: "https://armada.nu/about?section=team" }
    expect(redactPhotoTelemetryEvent(event)).toBe(event)
  })

  it("drops malformed URLs rather than sending them unmasked", () => {
    expect(redactPhotoTelemetryEvent({ url: "not a URL" })).toBeNull()
  })
})
