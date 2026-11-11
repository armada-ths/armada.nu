import { afterEach, describe, expect, it, vi } from "vitest"
vi.mock("@order/env", () => ({
  env: { NEXT_PUBLIC_API_URL: "https://cms.example" }
}))
import { fetchOrderAvailability, fetchOrderData } from "./cms"
const item = {
  id: 1,
  categoryId: 1,
  name: "Coffee",
  sortOrder: 0,
  soldOut: false
}
const category = { id: 1, name: "Drinks", sortOrder: 0 }
const company = { id: 1, name: "Gold AB", tier: "Gold" }
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
it("uses the CMS ordering decision without caching", async () => {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ open: false })
  })
  vi.stubGlobal("fetch", fetch)
  expect(await fetchOrderAvailability()).toEqual({ open: false })
  expect(fetch).toHaveBeenCalledWith(
    "https://cms.example/api/v1/lounge-orders/availability",
    expect.objectContaining({ cache: "no-store" })
  )
})
describe("live CMS order data", () => {
  it("requests the full Gold list without caching and includes sold-out products", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            revision: 1,
            items: [{ ...item, soldOut: true }],
            categories: [category]
          })
        })
        .mockResolvedValueOnce({ ok: true, json: async () => [company] })
    )
    expect(await fetchOrderData()).toEqual({
      items: [{ ...item, soldOut: true }],
      exhibitors: [company],
      categories: [category]
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
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ revision: 0, items: [], categories: [] })
        })
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
    )
    expect(await fetchOrderData()).toEqual({
      categories: [],
      items: [],
      exhibitors: []
    })
  })
  it.each([
    { ok: false, status: 503 },
    {
      ok: true,
      json: async () => ({
        revision: 0,
        items: [{ ...item, id: -1 }],
        categories: [category]
      })
    },
    {
      ok: true,
      json: async () => ({
        revision: 0,
        items: [item, item],
        categories: [category]
      })
    }
  ])("fails closed on failed or malformed responses", async response => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response)
        .mockResolvedValueOnce({ ok: true, json: async () => [company] })
    )
    expect(await fetchOrderData()).toBeNull()
    expect(console.error).toHaveBeenCalled()
  })
  it("rejects orphaned items instead of silently hiding them", async () => {
    const catalogue = {
      revision: 1,
      categories: [category, { id: 2, name: "Snacks", sortOrder: 0 }],
      items: [{ ...item, categoryId: 99 }]
    }
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => catalogue })
        .mockResolvedValueOnce({ ok: true, json: async () => [company] })
    )
    expect(await fetchOrderData()).toBeNull()
    expect(console.error).toHaveBeenCalledWith(
      "Order CMS response contains an unknown category"
    )
  })
  it("sorts category and item positions independently", async () => {
    const catalogue = {
      revision: 1,
      categories: [
        { ...category, sortOrder: 2 },
        { id: 2, name: "Snacks", sortOrder: 0 }
      ],
      items: [
        { ...item, id: 2, categoryId: 2, sortOrder: 3 },
        { ...item, sortOrder: 1 }
      ]
    }
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => catalogue })
        .mockResolvedValueOnce({ ok: true, json: async () => [company] })
    )
    const data = await fetchOrderData()
    expect(data?.categories.map(category => category.id)).toEqual([2, 1])
    expect(data?.items.map(item => item.id)).toEqual([1, 2])
  })
})
