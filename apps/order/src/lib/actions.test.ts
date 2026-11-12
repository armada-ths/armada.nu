import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const state = vi.hoisted(() => ({
  cookie: "secret",
  env: {
    NEXT_PUBLIC_API_URL: "https://cms.example",
    EXPO_ACCESS_TOKEN: "secret",
    LOUNGE_ORDER_SUBMISSION_SECRET: "live-service",
    LOUNGE_ORDER_TEST_SUBMISSION_SECRET: "test-service"
  }
}))
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: state.cookie }) })
}))
vi.mock("@order/env", () => ({ env: state.env }))
import { refreshOrderData, sendOrder } from "../app/actions"
const input = {
  idempotencyKey: "8f9bd464-4f0a-463e-81b6-26e2a76c170f",
  exhibitorId: 1,
  items: [{ id: "1", quantity: 1 }]
}
const order = { id: 42, isTest: true }
const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status })

describe("persistent order submission", () => {
  beforeEach(() => {
    state.cookie = "secret"
    state.env.LOUNGE_ORDER_TEST_SUBMISSION_SECRET = "test-service"
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse(order, 201))
    )
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
  it("rejects direct submissions without access", async () => {
    state.cookie = "wrong"
    expect(await sendOrder(input)).toEqual({
      success: false,
      errorCode: "access_required"
    })
    expect(fetch).not.toHaveBeenCalled()
  })
  it("rejects a rotated link on refresh and direct submission", async () => {
    state.cookie = "lo_" + "a".repeat(64)
    vi.mocked(fetch).mockImplementation(async () =>
      jsonResponse({ open: true, managedLink: true, accessGranted: false })
    )
    const denied = { success: false, errorCode: "access_required" }
    expect(await refreshOrderData()).toEqual(denied)
    expect(await sendOrder(input)).toEqual(denied)
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenCalledWith(
      "https://cms.example/api/v1/lounge-orders/availability",
      expect.objectContaining({ headers: { "X-Lounge-Access": state.cookie } })
    )
  })
  it("submits with a CMS-approved order link", async () => {
    state.cookie = "lo_" + "b".repeat(64)
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ open: true, managedLink: true, accessGranted: true })
    )
    expect(await sendOrder(input)).toEqual({ success: true, orderId: 42 })
    expect(fetch).toHaveBeenLastCalledWith(
      "https://cms.example/api/v1/lounge-orders/submit",
      expect.objectContaining({
        headers: expect.objectContaining({ "X-Lounge-Access": state.cookie })
      })
    )
  })
  it("surfaces CMS revocation of a legacy session at submission", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ errorCode: "access_required" }, 401)
    )
    expect(await sendOrder(input)).toEqual({
      success: false,
      errorCode: "access_required"
    })
  })
  it("validates idempotency keys and quantities at the action boundary", async () => {
    expect((await sendOrder({ ...input, idempotencyKey: "bad" })).success).toBe(
      false
    )
    expect((await sendOrder({ ...input, items: [] })).success).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("submits once to CMS using server-only test credentials", async () => {
    expect(await sendOrder(input)).toEqual({ success: true, orderId: 42 })
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      "https://cms.example/api/v1/lounge-orders/submit",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-service",
          "X-Lounge-Access": "secret"
        }),
        body: JSON.stringify(input)
      })
    )
  })
  it("uses live credentials in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production")
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ ...order, isTest: false })
    )
    expect(await sendOrder(input)).toEqual({ success: true, orderId: 42 })
    expect(vi.mocked(fetch).mock.calls[0][1]?.headers).toMatchObject({
      Authorization: "Bearer live-service"
    })
  })
  it.each([
    "orders_closed",
    "items_changed",
    "company_ineligible",
    "availability_unavailable"
  ])("surfaces CMS validation %s without sending Slack", async errorCode => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ errorCode }, 400))
    expect(await sendOrder(input)).toEqual({ success: false, errorCode })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it("fails if persistence is unavailable and never sends Slack", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("offline"))
    expect(await sendOrder(input)).toEqual({
      success: false,
      errorCode: "submission_failed"
    })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it("does not fall back to production CMS credentials", async () => {
    state.env.LOUNGE_ORDER_TEST_SUBMISSION_SECRET = ""
    expect((await sendOrder(input)).success).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("rejects a saved order from a mismatched environment", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ ...order, isTest: false })
    )
    expect(await sendOrder(input)).toEqual({
      success: false,
      errorCode: "submission_failed"
    })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
