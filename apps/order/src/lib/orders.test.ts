import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { validateOrder, hasOrderAccess, isOrderOpen } from "./orders"
import type { OrderData } from "./catalogue"
const data: OrderData = {
  exhibitors: [{ id: 1, name: "Gold AB", tier: "Gold" }],
  items: [
    { id: 1, name: "Coffee", sortOrder: 0, soldOut: false, maxPerOrder: 3 }
  ]
}

const dates = { fair: { days: ["2026-11-17", "2026-11-18"] } }
describe("order access and opening times", () => {
  it("fails closed when the secret or cookie is missing", () => {
    expect(hasOrderAccess(undefined, undefined)).toBe(false)
    expect(hasOrderAccess("", "")).toBe(false)
    expect(hasOrderAccess("wrong", "secret")).toBe(false)
    expect(hasOrderAccess("secret", "secret")).toBe(true)
  })
  it.each([
    ["2026-11-16T12:00:00", true],
    ["2026-11-17T15:30:00", true],
    ["2026-11-17T15:30:01", false],
    ["2026-11-18T09:59:59", false],
    ["2026-11-18T10:00:00", true],
    ["2026-11-18T14:30:00", true],
    ["2026-11-18T14:30:01", false],
    ["2026-11-19T10:00:00", false]
  ])("checks Stockholm time %s", (time, open) => {
    expect(
      isOrderOpen(dates, DateTime.fromISO(time, { zone: "Europe/Stockholm" }))
    ).toBe(open)
  })
  it("rejects missing, malformed and reversed dates", () => {
    for (const input of [
      null,
      { fair: { days: [123, {}] } },
      { fair: { days: [] } },
      { fair: { days: ["invalid", "2026-11-18"] } },
      { fair: { days: ["2026-11-18", "2026-11-17"] } }
    ])
      expect(isOrderOpen(input)).toBe(false)
  })
})
describe("order payload", () => {
  it("formats canonical CMS item and Gold company names", () => {
    expect(
      validateOrder(
        {
          exhibitorId: 1,
          items: [{ id: "1", quantity: 2 }]
        },
        data
      )
    ).toEqual({ success: true, message: "Order for Gold AB:\n- Coffee x2" })
  })
  it.each([
    { exhibitorId: 0, items: [{ id: "1", quantity: 1 }] },
    { exhibitorId: 1, items: [] },
    { exhibitorId: 1, items: [{ id: "unknown", quantity: 1 }] },
    { exhibitorId: 1, items: [{ id: "1", quantity: 0 }] },
    { exhibitorId: 1, items: [{ id: "1", quantity: 1.5 }] },
    { exhibitorId: 1, items: [{ id: "1", quantity: 4 }] },
    { company: "Custom AB", items: [{ id: "1", quantity: 1 }] },
    { exhibitorId: 2, items: [{ id: "1", quantity: 1 }] },
    {
      exhibitorId: 1,
      items: [
        { id: "1", quantity: 1 },
        { id: "1", quantity: 2 }
      ]
    }
  ])("rejects invalid input", input =>
    expect(validateOrder(input, data).success).toBe(false)
  )
  it("rejects sold-out or deleted items and revoked eligibility", () => {
    const input = { exhibitorId: 1, items: [{ id: "1", quantity: 1 }] }
    expect(
      validateOrder(input, {
        ...data,
        items: [{ ...data.items[0], soldOut: true }]
      })
    ).toEqual({ success: false, errorCode: "items_changed" })
    expect(validateOrder(input, { ...data, items: [] })).toEqual({
      success: false,
      errorCode: "items_changed"
    })
    expect(validateOrder(input, { ...data, exhibitors: [] })).toEqual({
      success: false,
      errorCode: "company_ineligible"
    })
  })
})
