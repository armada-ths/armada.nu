import { describe, expect, it } from "vitest"
import { redactAppTelemetry } from "./telemetry-utils"

describe("app telemetry", () => {
  it.each([
    "photos.armada.nu",
    "staging.photos.armada.nu",
    "photos-pr.vercel.app"
  ])("redacts photos on %s", hostname => {
    expect(
      redactAppTelemetry(
        {
          url: `https://${hostname}/e/private?guest_id=private#private`,
          route: "/e/private"
        },
        "photos"
      )
    ).toEqual({ url: `https://${hostname}/e/:redacted`, route: "/e/:redacted" })
  })
  it.each([
    "order.armada.nu",
    "staging.order.armada.nu",
    "order-pr.vercel.app"
  ])("redacts order credentials on %s", hostname => {
    expect(
      redactAppTelemetry(
        {
          url: `https://${hostname}/?access=private#private`,
          route: "/?access=private"
        },
        "order"
      )
    ).toEqual({ url: `https://${hostname}/`, route: "/" })
  })
  it("rejects malformed URLs", () =>
    expect(redactAppTelemetry({ url: "invalid" }, "order")).toBeNull())
})
