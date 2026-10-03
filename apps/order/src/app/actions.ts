"use server"
import { cookies } from "next/headers"
import { env } from "@order/env"
import { fetchDates } from "@order/lib/cms"
import {
  formatOrder,
  hasOrderAccess,
  isOrderOpen,
  type OrderInput,
  type OrderResult
} from "@order/lib/orders"

export async function sendOrder(input: OrderInput): Promise<OrderResult> {
  if (
    !hasOrderAccess((await cookies()).get("_ea")?.value, env.EXPO_ACCESS_TOKEN)
  ) {
    return { success: false, error: "Please open your exhibitor access link." }
  }
  if (!isOrderOpen(await fetchDates()))
    return { success: false, error: "The order form is currently closed." }
  const message = formatOrder(input)
  if (!message)
    return {
      success: false,
      error: "Please check your company name and selected items."
    }
  const production = process.env.VERCEL_ENV === "production"
  const webhook = production
    ? env.SLACK_ORDER_HOOK_URL
    : env.SLACK_ORDER_TEST_HOOK_URL
  if (!webhook || (!production && webhook === env.SLACK_ORDER_HOOK_URL)) {
    return { success: false, error: "Order delivery is not configured." }
  }
  try {
    const url = new URL(webhook)
    if (url.protocol !== "https:" || url.hostname !== "hooks.slack.com")
      return { success: false, error: "Order delivery is not configured." }
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: production ? message : `[STAGING TEST] ${message}`
      }),
      signal: AbortSignal.timeout(10000)
    })
    return response.ok
      ? { success: true }
      : {
          success: false,
          error: "Could not deliver your order. Please try again."
        }
  } catch {
    return {
      success: false,
      error: "Could not deliver your order. Please try again."
    }
  }
}
