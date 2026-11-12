"use server"
import { cookies } from "next/headers"
import { fetchOrderAvailability, fetchOrderData } from "@order/lib/cms"
import { saveOrder } from "@order/lib/submission"
import {
  isManagedOrderToken,
  orderInputSchema,
  type OrderInput,
  type OrderResult,
  type OrderDataResult
} from "@order/lib/orders"

export async function refreshOrderData(): Promise<OrderDataResult> {
  const token = (await cookies()).get("_ea")?.value
  if (!isManagedOrderToken(token))
    return { success: false, errorCode: "access_required" }

  const availability = await fetchOrderAvailability(token)
  if (!availability)
    return { success: false, errorCode: "availability_unavailable" }
  if (!availability.accessGranted)
    return { success: false, errorCode: "access_required" }
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
  const token = (await cookies()).get("_ea")?.value
  if (!isManagedOrderToken(token))
    return { success: false, errorCode: "access_required" }

  const parsed = orderInputSchema.safeParse(input)
  if (!parsed.success) return { success: false, errorCode: "invalid_order" }

  const availability = await fetchOrderAvailability(token)
  if (!availability)
    return { success: false, errorCode: "availability_unavailable" }
  if (!availability.accessGranted)
    return { success: false, errorCode: "access_required" }

  return saveOrder(parsed.data, token)
}
