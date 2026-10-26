import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server"
import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"

import { config, proxy } from "../proxy"

describe("locale proxy", () => {
  it.each([
    ["/about", "sv-SE, en;q=0.8", null, "/sv/about"],
    ["/about", "sv-SE", "locale=en", "/en/about"],
    ["/sv/about", "en", "locale=en", null]
  ])(
    "uses URL, cookie and browser language priority",
    (path, language, cookie, expected) => {
      const headers = new Headers({ "accept-language": language })
      if (cookie) headers.set("cookie", cookie)
      const result = proxy(
        new NextRequest("https://armada.nu" + path, { headers })
      )
      expect(result.headers.get("location")).toBe(
        expected ? "https://armada.nu" + expected : null
      )
    }
  )

  it.each([
    "/api/revalidate",
    "/_next/static/chunks/app.js",
    "/_next/image",
    "/favicon.ico",
    "/icons/favicon.ico"
  ])("does not localize %s", url => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })).toBe(
      false
    )
  })

  it.each(["/", "/about", "/sv/about"])(
    "localizes page requests to %s",
    url => {
      expect(
        unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })
      ).toBe(true)
    }
  )

  it("redirects unprefixed pages while preserving query parameters", () => {
    const response = proxy(
      new NextRequest("https://armada.nu/student/events?id=1")
    )
    expect(response.headers.get("location")).toBe(
      "https://armada.nu/en/student/events?id=1"
    )
  })

  it("keeps the locale prefix and forwards the request locale", () => {
    const response = proxy(new NextRequest("https://armada.nu/sv/about"))
    expect(response.headers.get("x-middleware-rewrite")).toBeNull()
    expect(
      response.headers.get("x-middleware-request-x-next-intl-locale")
    ).toBe("sv")
  })
})
