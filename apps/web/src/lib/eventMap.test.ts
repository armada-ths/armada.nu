import { describe, expect, it, vi } from "vitest"
import { eventMapEmbedUrl, isShortMapLink, resolveEventMap } from "./eventMap"

describe("event maps", () => {
  it("does not resolve short links when no API key is configured", async () => {
    const fetcher = vi.fn()
    expect(
      await resolveEventMap("https://maps.app.goo.gl/example", "", fetcher)
    ).toBeNull()
    expect(fetcher).not.toHaveBeenCalled()
  })
  it("uses the official API and requires a configured key", () => {
    const source = "https://www.google.com/maps?q=Nymble"
    const url = new URL(eventMapEmbedUrl(source, "test-key")!)
    expect(url.pathname).toBe("/maps/embed/v1/place")
    expect(url.searchParams.get("key")).toBe("test-key")
    expect(url.searchParams.get("q")).toBe("Nymble")
    expect(eventMapEmbedUrl(source, "")).toBeNull()
    expect(eventMapEmbedUrl(source, "  ")).toBeNull()
  })
  it("maps Google queries, place names and precise pins", () => {
    for (const link of [
      "https://maps.google.com/?q=59.3,18.1",
      "https://www.google.com/maps/search/?api=1&query=59.3,18.1",
      "https://www.google.com/maps/place/Nymble/@59,18,15z/data=!3d59.3!4d18.1"
    ])
      expect(
        new URL(eventMapEmbedUrl(link, "test-key")!).searchParams.get("q")
      ).toBe("59.3,18.1")
    expect(
      new URL(
        eventMapEmbedUrl(
          "https://www.google.com/maps/place/Nymble+Stockholm/",
          "test-key"
        )!
      ).searchParams.get("q")
    ).toBe("Nymble Stockholm")
  })
  it("omits invalid, unsupported or unsafe URLs", () => {
    for (const value of [
      null,
      "",
      "javascript:alert(1)",
      "https://example.com/",
      "https://www.google.com.evil.test/maps?q=KTH",
      "https://www.google.com/maps/place/%ZZ",
      "https://www.openstreetmap.org/?mlat=59.3&mlon=18.1",
      "https://openstreetmap.org/?mlat=&mlon=18"
    ])
      expect(eventMapEmbedUrl(value, "test-key")).toBeNull()
  })
  it("resolves a short map link", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 302,
        headers: { location: "https://www.google.com/maps?q=Nymble" }
      })
    )
    const result = await resolveEventMap(
      "https://maps.app.goo.gl/example",
      "test-key",
      fetcher
    )
    expect(new URL(result!).searchParams.get("q")).toBe("Nymble")
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
  it("never follows redirects to arbitrary hosts or credentials", async () => {
    for (const location of [
      "http://127.0.0.1/",
      "https://example.com/",
      "https://user:pass@www.google.com/maps?q=x",
      "https://maps.app.goo.gl:444/x"
    ]) {
      const fetcher = vi
        .fn()
        .mockResolvedValue(
          new Response(null, { status: 302, headers: { location } })
        )
      expect(
        await resolveEventMap(
          "https://maps.app.goo.gl/example",
          "test-key",
          fetcher
        )
      ).toBeNull()
      expect(fetcher).toHaveBeenCalledTimes(1)
    }
    expect(isShortMapLink("https://goo.gl/unrelated")).toBe(false)
  })
  it("bounds redirect loops and handles unresolved links", async () => {
    const loop = vi
      .fn()
      .mockImplementation(
        () =>
          new Response(null, { status: 302, headers: { location: "/loop" } })
      )
    expect(
      await resolveEventMap("https://maps.app.goo.gl/example", "test-key", loop)
    ).toBeNull()
    expect(loop).toHaveBeenCalledTimes(4)
    expect(
      await resolveEventMap(
        "https://maps.app.goo.gl/example",
        "test-key",
        vi.fn().mockResolvedValue(new Response(null))
      )
    ).toBeNull()
  })
})
