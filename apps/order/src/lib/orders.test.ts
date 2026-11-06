import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { hasOrderAccess, isOrderOpen } from "./orders"

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
