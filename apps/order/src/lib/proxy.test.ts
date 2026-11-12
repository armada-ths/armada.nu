import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { proxy, config } from "../proxy"
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server"

const token = "lo_" + "a".repeat(64)
describe("localized order access", () => {
  it.each(["en", "sv"])(
    "strips the access token on /%s and keeps other query values",
    locale => {
      const response = proxy(
        new NextRequest(
          "https://order.armada.nu/" + locale + `?access=${token}&view=cart`
        )
      )
      expect(response.headers.get("location")).toBe(
        "https://order.armada.nu/" + locale + "?view=cart"
      )
      expect(response.cookies.get("_ea")).toMatchObject({
        value: token,
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
    const response = proxy(
      new NextRequest(`https://order.armada.nu/?access=${token}`, {
        headers: { "accept-language": "sv-SE" }
      })
    )
    expect(response.headers.get("location")).toBe("https://order.armada.nu/sv")
  })
  it("strips a managed link token and passes it to server-side validation in an HTTP-only cookie", () => {
    const response = proxy(
      new NextRequest(`https://order.armada.nu/en?access=${token}`)
    )
    expect(response.headers.get("location")).toBe("https://order.armada.nu/en")
    expect(response.cookies.get("_ea")).toMatchObject({
      value: token,
      httpOnly: true,
      secure: true
    })
  })
  it("never grants access for an invalid token", () => {
    const response = proxy(
      new NextRequest("https://order.armada.nu/sv?access=old-expo-token")
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
