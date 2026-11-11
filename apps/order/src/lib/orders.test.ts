import { describe, expect, it } from "vitest"
import { hasOrderAccess } from "./orders"

describe("order access", () => {
  it("fails closed when the secret or cookie is missing", () => {
    expect(hasOrderAccess(undefined, undefined)).toBe(false)
    expect(hasOrderAccess("", "")).toBe(false)
    expect(hasOrderAccess("wrong", "secret")).toBe(false)
    expect(hasOrderAccess("secret", "secret")).toBe(true)
  })
})
