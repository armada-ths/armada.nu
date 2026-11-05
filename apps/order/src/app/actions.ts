"use server"
import { cookies } from "next/headers"
import { env } from "@order/env"
import { fetchDates, fetchOrderData } from "@order/lib/cms"
import {
  validateOrder,
  hasOrderAccess,
  isOrderOpen,
  type OrderInput,
  type OrderResult,
  type OrderDataResult
} from "@order/lib/orders"

export async function refreshOrderData(): Promise<OrderDataResult> {
  if (
    !hasOrderAccess((await cookies()).get("_ea")?.value, env.EXPO_ACCESS_TOKEN)
  ) {
    return {
      success: false,
      errorCode: "access_required"
    }
  }
  const dates = await fetchDates()
  if (!dates) return { success: false, errorCode: "availability_unavailable" }
  if (!isOrderOpen(dates))
    return {
      success: false,
      errorCode: "orders_closed"
    }
  const data = await fetchOrderData()
  return data
    ? { success: true, data }
    : { success: false, errorCode: "availability_unavailable" }
}

export async function sendOrder(input: OrderInput): Promise<OrderResult> {
  const current = await refreshOrderData()
  if (!current.success) return current
  const validated = validateOrder(input, current.data)
  if (!validated.success) return validated
  const message = validated.message
  const production = process.env.VERCEL_ENV === "production"
  const webhook = production
    ? env.SLACK_ORDER_HOOK_URL
    : env.SLACK_ORDER_TEST_HOOK_URL
  if (!webhook || (!production && webhook === env.SLACK_ORDER_HOOK_URL)) {
    return {
      success: false,
      errorCode: "delivery_unavailable",
      error: "Order delivery is not configured."
    }
  }
  try {
    const url = new URL(webhook)
    if (url.protocol !== "https:" || url.hostname !== "hooks.slack.com")
      return {
        success: false,
        errorCode: "delivery_unavailable",
        error: "Order delivery is not configured."
      }
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
          errorCode: "delivery_failed",
          error: "Could not deliver your order. Please try again."
        }
  } catch {
    return {
      success: false,
      errorCode: "delivery_failed",
      error: "Could not deliver your order. Please try again."
    }
  }
}
