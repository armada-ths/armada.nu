import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const state = vi.hoisted(() => ({
  cookie: "secret",
  env: {
    NEXT_PUBLIC_API_URL: "https://cms.example",
    EXPO_ACCESS_TOKEN: "secret",
    SLACK_ORDER_HOOK_URL: "https://hooks.slack.com/services/production",
    SLACK_ORDER_TEST_HOOK_URL: "https://hooks.slack.com/services/test",
    LOUNGE_ORDER_SUBMISSION_SECRET: "live-service",
    LOUNGE_ORDER_TEST_SUBMISSION_SECRET: "test-service",
    ORDER_INTERNAL_SECRET: "internal-secret"
  }
}))
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: state.cookie }) })
}))
vi.mock("@order/env", () => ({ env: state.env }))
import { sendOrder } from "../app/actions"
import { POST } from "../app/api/internal/order-delivery/route"
const input = {
  idempotencyKey: "8f9bd464-4f0a-463e-81b6-26e2a76c170f",
  exhibitorId: 1,
  items: [{ id: "1", quantity: 1 }]
}
const order = {
  id: 42,
  companyName: "Gold AB",
  isTest: true,
  status: "pending",
  deliveryStatus: "pending",
  lines: [
    {
      itemId: 1,
      categoryId: 1,
      itemName: "Coffee",
      categoryName: "Drinks",
      quantity: 1
    }
  ]
}
const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status })

describe("persistent order submission and notification", () => {
  beforeEach(() => {
    state.cookie = "secret"
    state.env.SLACK_ORDER_TEST_HOOK_URL =
      "https://hooks.slack.com/services/test"
    state.env.LOUNGE_ORDER_TEST_SUBMISSION_SECRET = "test-service"
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        const path = String(url)
        if (path.endsWith("/submit")) return jsonResponse(order, 201)
        if (path.endsWith("/claim"))
          return jsonResponse({ claimed: true, claimToken: "claim", order })
        if (path.endsWith("/delivery")) return jsonResponse({ success: true })
        return new Response("ok")
      })
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
  it("validates idempotency keys and quantities at the action boundary", async () => {
    expect((await sendOrder({ ...input, idempotencyKey: "bad" })).success).toBe(
      false
    )
    expect((await sendOrder({ ...input, items: [] })).success).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("saves before Slack, using server-only test credentials and accepted snapshots", async () => {
    expect(await sendOrder(input)).toEqual({ success: true, orderId: 42 })
    const calls = vi.mocked(fetch).mock.calls
    expect(String(calls[0][0])).toMatch(/\/submit$/)
    expect(calls[0][1]?.headers).toMatchObject({
      Authorization: "Bearer test-service"
    })
    expect(JSON.parse(String(calls[0][1]?.body))).toEqual(input)
    expect(String(calls[2][0])).toBe(state.env.SLACK_ORDER_TEST_HOOK_URL)
    expect(JSON.parse(String(calls[2][1]?.body))).toEqual({
      text: "*[STAGING TEST]*\n*Order #42 —— Gold AB:*\n\n*_Drinks:_*\n- Coffee x 1",
      mrkdwn: true
    })
    expect(JSON.parse(String(calls[3][1]?.body))).toEqual({
      claimToken: "claim",
      status: "sent"
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
  it("keeps accepted orders successful if Slack rejects the notification", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(order))
      .mockResolvedValueOnce(
        jsonResponse({ claimed: true, claimToken: "claim", order })
      )
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
    expect(await sendOrder(input)).toEqual({ success: true, orderId: 42 })
    expect(JSON.parse(String(vi.mocked(fetch).mock.calls[3][1]?.body))).toEqual(
      { claimToken: "claim", status: "failed", error: "slack_rejected" }
    )
  })
  it("reports ambiguous Slack timeouts instead of automatically retrying", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(order))
      .mockResolvedValueOnce(
        jsonResponse({ claimed: true, claimToken: "claim", order })
      )
      .mockRejectedValueOnce(new Error("timeout"))
    expect((await sendOrder(input)).success).toBe(true)
    expect(
      JSON.parse(String(vi.mocked(fetch).mock.calls[3][1]?.body)).status
    ).toBe("unknown")
  })
  it("does not deliver an order when another attempt already claimed it", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(order))
      .mockResolvedValueOnce(jsonResponse({ claimed: false }))
    expect(await sendOrder(input)).toEqual({ success: true, orderId: 42 })
    expect(fetch).toHaveBeenCalledTimes(2)
  })
  it("does not lose accepted orders if reporting delivery fails", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(order))
      .mockResolvedValueOnce(
        jsonResponse({ claimed: true, claimToken: "claim", order })
      )
      .mockResolvedValueOnce(new Response("ok"))
      .mockRejectedValueOnce(new Error("offline"))
    expect((await sendOrder(input)).success).toBe(true)
    expect(console.error).toHaveBeenCalled()
  })
  it.each(["", "https://hooks.slack.com/services/production"])(
    "never falls back to production Slack when test configuration is %s",
    async webhook => {
      state.env.SLACK_ORDER_TEST_HOOK_URL = webhook
      expect((await sendOrder(input)).success).toBe(true)
      expect(
        vi
          .mocked(fetch)
          .mock.calls.some(
            ([url]) => new URL(String(url)).hostname === "hooks.slack.com"
          )
      ).toBe(false)
      expect(
        JSON.parse(String(vi.mocked(fetch).mock.calls[2][1]?.body)).error
      ).toBe("not_configured")
    }
  )
  it("does not fall back to production CMS credentials", async () => {
    state.env.LOUNGE_ORDER_TEST_SUBMISSION_SECRET = ""
    expect((await sendOrder(input)).success).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("rejects internal retries without authentication or with a mismatched environment", async () => {
    expect(
      (
        await POST(
          new Request("http://localhost/api/internal/order-delivery", {
            method: "POST",
            body: "{}"
          })
        )
      ).status
    ).toBe(401)
    const request = new Request(
      "http://localhost/api/internal/order-delivery",
      {
        method: "POST",
        headers: { Authorization: "Bearer internal-secret" },
        body: JSON.stringify({ orderId: 42, isTest: false })
      }
    )
    expect((await POST(request)).status).toBe(400)
    expect(fetch).not.toHaveBeenCalled()
  })
  it("allows an authenticated CMS retry through the same claim/report path", async () => {
    const request = new Request(
      "http://localhost/api/internal/order-delivery",
      {
        method: "POST",
        headers: { Authorization: "Bearer internal-secret" },
        body: JSON.stringify({ orderId: 42, isTest: true })
      }
    )
    expect((await POST(request)).status).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(3)
  })
})
