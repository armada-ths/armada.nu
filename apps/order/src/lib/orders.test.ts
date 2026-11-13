import { describe, expect, it } from "vitest"
import { isManagedOrderToken } from "./orders"

describe("order link token format", () => {
  it("requires a CMS-generated token", () => {
    expect(isManagedOrderToken(undefined)).toBe(false)
    expect(isManagedOrderToken("")).toBe(false)
    expect(isManagedOrderToken("old-expo-token")).toBe(false)
    expect(isManagedOrderToken("lo_" + "a".repeat(64))).toBe(true)
  })
})
