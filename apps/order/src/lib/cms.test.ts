import { afterEach, describe, expect, it, vi } from "vitest"
vi.mock("@order/env", () => ({
  env: { NEXT_PUBLIC_API_URL: "https://cms.example" }
}))
import { fetchOrderData } from "./cms"
const item = { id: 1, name: "Coffee", sortOrder: 0, soldOut: false }
const company = { id: 1, name: "Gold AB", tier: "Gold" }
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
describe("live CMS order data", () => {
  it("requests the full Gold list without caching and includes sold-out products", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ ...item, soldOut: true }]
        })
        .mockResolvedValueOnce({ ok: true, json: async () => [company] })
    )
    expect(await fetchOrderData()).toEqual({
      items: [{ ...item, soldOut: true }],
      exhibitors: [company]
    })
    const url = new URL(vi.mocked(fetch).mock.calls[1][0].toString())
    expect(url.searchParams.get("all")).toBe("true")
    expect(JSON.parse(url.searchParams.get("filter")!)).toEqual({
      tier: "Gold"
    })
    expect(vi.mocked(fetch).mock.calls[0][1]?.cache).toBe("no-store")
  })
  it("distinguishes an empty menu from an unavailable one", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
    )
    expect(await fetchOrderData()).toEqual({ items: [], exhibitors: [] })
  })
  it.each([
    { ok: false, status: 503 },
    { ok: true, json: async () => [{ ...item, id: -1 }] },
    { ok: true, json: async () => [item, item] }
  ])("fails closed on failed or malformed responses", async response => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response))
    expect(await fetchOrderData()).toBeNull()
    expect(console.error).toHaveBeenCalled()
  })
})
