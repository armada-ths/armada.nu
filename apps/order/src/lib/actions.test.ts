import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const state = vi.hoisted(() => ({
  cookie: "secret",
  dates: { fair: { days: ["2026-11-17", "2026-11-18"] } },
  env: {
    EXPO_ACCESS_TOKEN: "secret",
    SLACK_ORDER_HOOK_URL: "https://hooks.slack.com/services/production",
    SLACK_ORDER_TEST_HOOK_URL: "https://hooks.slack.com/services/test"
  }
}))
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: state.cookie }) })
}))
vi.mock("@order/env", () => ({ env: state.env }))
vi.mock("@order/lib/cms", () => ({ fetchDates: async () => state.dates }))
import { sendOrder } from "../app/actions"

const input = { company: "Test AB", items: [{ id: "coffee", quantity: 1 }] }
describe("order submission", () => {
  beforeEach(() => {
    state.cookie = "secret"
    state.env.SLACK_ORDER_TEST_HOOK_URL =
      "https://hooks.slack.com/services/test"
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-11-16T12:00:00Z"))
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })
  it("rejects direct submission without access", async () => {
    state.cookie = "wrong"
    expect((await sendOrder(input)).success).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("rejects direct submission when closed", async () => {
    vi.setSystemTime(new Date("2026-11-19T12:00:00Z"))
    expect((await sendOrder(input)).success).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("only sends preview orders to the test channel", async () => {
    expect((await sendOrder(input)).success).toBe(true)
    expect(fetch).toHaveBeenCalledWith(
      new URL(state.env.SLACK_ORDER_TEST_HOOK_URL),
      expect.objectContaining({
        body: expect.stringContaining("[STAGING TEST]")
      })
    )
  })
  it("does not fall back to production when the test hook is absent", async () => {
    state.env.SLACK_ORDER_TEST_HOOK_URL = ""
    expect((await sendOrder(input)).success).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("rejects a test hook equal to the production hook", async () => {
    state.env.SLACK_ORDER_TEST_HOOK_URL = state.env.SLACK_ORDER_HOOK_URL
    expect((await sendOrder(input)).success).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("reports delivery failures without leaking the webhook or Slack response", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response)
    expect(await sendOrder(input)).toEqual({
      success: false,
      error: "Could not deliver your order. Please try again."
    })
  })
})
