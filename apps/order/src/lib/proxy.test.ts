import { afterEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { proxy, config } from "../proxy"
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server"

afterEach(() => vi.unstubAllEnvs())
describe("localized order access", () => {
  it.each(["en", "sv"])(
    "strips the access token on /%s and keeps other query values",
    locale => {
      vi.stubEnv("EXPO_ACCESS_TOKEN", "secret")
      const response = proxy(
        new NextRequest(
          "https://order.armada.nu/" + locale + "?access=secret&view=cart"
        )
      )
      expect(response.headers.get("location")).toBe(
        "https://order.armada.nu/" + locale + "?view=cart"
      )
      expect(response.cookies.get("_ea")).toMatchObject({
        value: "secret",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 604800
      })
      expect(response.cookies.get("_ea")?.domain).toBeUndefined()
      expect(response.headers.get("referrer-policy")).toBe("no-referrer")
    }
  )
  it("negotiates a regional browser language before completing access", () => {
    vi.stubEnv("EXPO_ACCESS_TOKEN", "secret")
    const response = proxy(
      new NextRequest("https://order.armada.nu/?access=secret", {
        headers: { "accept-language": "sv-SE" }
      })
    )
    expect(response.headers.get("location")).toBe("https://order.armada.nu/sv")
  })
  it("never grants access for an invalid token", () => {
    vi.stubEnv("EXPO_ACCESS_TOKEN", "secret")
    const response = proxy(
      new NextRequest("https://order.armada.nu/sv?access=wrong")
    )
    expect(response.cookies.get("_ea")).toBeUndefined()
    expect(response.headers.get("location")).toBe("https://order.armada.nu/sv")
  })
  it.each(["/api/test", "/_next/image", "/icons/favicon.ico"])(
    "does not route resources through locale negotiation: %s",
    url => {
      expect(
        unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })
      ).toBe(false)
    }
  )
})
