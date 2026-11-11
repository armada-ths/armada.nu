"use server"
import { cookies } from "next/headers"
import { env } from "@order/env"
import { fetchOrderAvailability, fetchOrderData } from "@order/lib/cms"
import { saveOrder, deliverSavedOrder } from "@order/lib/delivery"
import {
  hasOrderAccess,
  orderInputSchema,
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
  const availability = await fetchOrderAvailability()
  if (!availability)
    return { success: false, errorCode: "availability_unavailable" }
  if (!availability.open)
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
  if (
    !hasOrderAccess((await cookies()).get("_ea")?.value, env.EXPO_ACCESS_TOKEN)
  )
    return { success: false, errorCode: "access_required" }
  const parsed = orderInputSchema.safeParse(input)
  if (!parsed.success) return { success: false, errorCode: "invalid_order" }
  const saved = await saveOrder(parsed.data)
  if (!saved.success) return saved
  // Persistence is authoritative; a notification failure never loses the order.
  await deliverSavedOrder(saved.data.id)
  return { success: true, orderId: saved.data.id }
}
