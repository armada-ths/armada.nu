import { describe, expect, it } from "vitest"

import { usesLocalPhotoApi } from "./photoRecaptcha"

describe("usesLocalPhotoApi", () => {
  it("selects local routing and the test key only for a local API in development", () => {
    expect(usesLocalPhotoApi("http://localhost:8080", "development")).toBe(true)
    expect(usesLocalPhotoApi("http://127.0.0.1:8080", "development")).toBe(true)
  })

  it("disables local test configuration for hosted APIs and production builds", () => {
    expect(usesLocalPhotoApi("https://cms.armada.nu", "development")).toBe(
      false
    )
    expect(usesLocalPhotoApi("http://localhost:8080", "production")).toBe(false)
    expect(usesLocalPhotoApi("", "development")).toBe(false)
  })
})
