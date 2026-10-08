import { describe, expect, it } from "vitest"

import { isMobilePhotoDevice } from "./photoDevice"

describe("isMobilePhotoDevice", () => {
  it.each([
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)",
    "Mozilla/5.0 (Linux; Android 15) Chrome/140.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 15) Chrome/140.0 Safari/537.36"
  ])("allows phones and tablets: %s", userAgent => {
    expect(isMobilePhotoDevice({ userAgent, maxTouchPoints: 5 })).toBe(true)
  })

  it("allows iPadOS desktop mode", () => {
    expect(
      isMobilePhotoDevice({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        maxTouchPoints: 5
      })
    ).toBe(true)
  })

  it("allows mobile client hints without a recognized user agent", () => {
    expect(
      isMobilePhotoDevice({
        userAgent: "Reduced user agent",
        maxTouchPoints: 0,
        userAgentData: { mobile: true }
      })
    ).toBe(true)
  })

  it("does not reject Android tablets with a desktop client hint", () => {
    expect(
      isMobilePhotoDevice({
        userAgent: "Mozilla/5.0 (Linux; Android 15)",
        maxTouchPoints: 5,
        userAgentData: { mobile: false }
      })
    ).toBe(true)
  })

  it.each([
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 0],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 10],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0],
    ["Mozilla/5.0 (X11; Linux x86_64)", 0],
    ["", 0]
  ])("blocks desktop/unknown devices: %s", (userAgent, maxTouchPoints) => {
    expect(isMobilePhotoDevice({ userAgent, maxTouchPoints })).toBe(false)
  })
})
