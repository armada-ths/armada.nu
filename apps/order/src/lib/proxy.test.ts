import { afterEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { proxy } from "../proxy"

afterEach(() => vi.unstubAllEnvs())
describe("order access link", () => {
  it("clears the URL and creates a secure host-only cookie", () => {
    vi.stubEnv("EXPO_ACCESS_TOKEN", "secret")
    const response = proxy(
      new NextRequest("https://order.armada.nu/?access=secret")
    )
    expect(response.headers.get("location")).toBe("https://order.armada.nu/")
    expect(response.cookies.get("_ea")).toMatchObject({
      value: "secret",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 604800
    })
    expect(response.cookies.get("_ea")?.domain).toBeUndefined()
  })
  it("does not grant access for an invalid token", () => {
    vi.stubEnv("EXPO_ACCESS_TOKEN", "secret")
    const response = proxy(
      new NextRequest("https://order.armada.nu/?access=wrong")
    )
    expect(response.cookies.get("_ea")).toBeUndefined()
    expect(response.headers.get("location")).toBe("https://order.armada.nu/")
  })
})
