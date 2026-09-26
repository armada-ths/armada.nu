import { describe, expect, it } from "vitest"

import { shouldSkipPhotoRecaptcha } from "./photoRecaptcha"

describe("shouldSkipPhotoRecaptcha", () => {
  it("skips only for a local API in development", () => {
    expect(
      shouldSkipPhotoRecaptcha("http://localhost:8080", "development")
    ).toBe(true)
    expect(
      shouldSkipPhotoRecaptcha("http://127.0.0.1:8080", "development")
    ).toBe(true)
  })

  it("keeps verification for hosted APIs and production builds", () => {
    expect(
      shouldSkipPhotoRecaptcha("https://cms.armada.nu", "development")
    ).toBe(false)
    expect(
      shouldSkipPhotoRecaptcha("http://localhost:8080", "production")
    ).toBe(false)
    expect(shouldSkipPhotoRecaptcha("", "development")).toBe(false)
  })
})
