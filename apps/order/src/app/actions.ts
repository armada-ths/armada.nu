"use server"
import { cookies } from "next/headers"
import { env } from "@order/env"
import { fetchDates, fetchOrderData } from "@order/lib/cms"
import { z } from "zod"
import { saveOrder, deliverSavedOrder } from "@order/lib/delivery"
import {
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
  if (
    !hasOrderAccess((await cookies()).get("_ea")?.value, env.EXPO_ACCESS_TOKEN)
  )
    return { success: false, errorCode: "access_required" }
  const parsed = z
    .object({
      idempotencyKey: z.uuid(),
      exhibitorId: z.number().int().positive().safe(),
      items: z
        .array(
          z.object({
            id: z.string().regex(/^[1-9]\d*$/),
            quantity: z.number().int().positive().safe()
          })
        )
        .min(1)
        .max(1000)
    })
    .safeParse(input)
  if (!parsed.success) return { success: false, errorCode: "invalid_order" }
  const saved = await saveOrder(parsed.data)
  if (!saved.success) return saved
  // Persistence is authoritative; a notification failure never loses the order.
  await deliverSavedOrder(saved.data.id)
  return { success: true, orderId: saved.data.id }
}
