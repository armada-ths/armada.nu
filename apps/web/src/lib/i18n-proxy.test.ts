import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server"
import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"

import { config, proxy } from "../proxy"

describe("locale proxy", () => {
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

  it("rewrites Swedish pages with the request locale header", () => {
    const response = proxy(new NextRequest("https://armada.nu/sv/about"))
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://armada.nu/about"
    )
    expect(response.headers.get("x-middleware-request-x-armada-locale")).toBe(
      "sv"
    )
  })
})
