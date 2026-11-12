"use server"
import { cookies } from "next/headers"
import { env } from "@order/env"
import { fetchOrderAvailability, fetchOrderData } from "@order/lib/cms"
import { saveOrder } from "@order/lib/submission"
import {
  hasOrderAccess,
  isManagedOrderToken,
  orderInputSchema,
  type OrderInput,
  type OrderResult,
  type OrderDataResult
} from "@order/lib/orders"

export async function refreshOrderData(): Promise<OrderDataResult> {
  const token = (await cookies()).get("_ea")?.value
  const legacy = hasOrderAccess(token, env.EXPO_ACCESS_TOKEN)
  if (!legacy && !isManagedOrderToken(token))
    return { success: false, errorCode: "access_required" }

  const availability = await fetchOrderAvailability(token)
  if (!availability)
    return { success: false, errorCode: "availability_unavailable" }
  if (!(availability.managedLink ? availability.accessGranted : legacy))
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
  const legacy = hasOrderAccess(token, env.EXPO_ACCESS_TOKEN)
  if (!token || (!legacy && !isManagedOrderToken(token)))
    return { success: false, errorCode: "access_required" }

  const parsed = orderInputSchema.safeParse(input)
  if (!parsed.success) return { success: false, errorCode: "invalid_order" }

  // An older CMS can still accept submissions from the legacy order app.
  // Require a positive CMS access decision before forwarding a managed token.
  if (!legacy) {
    const availability = await fetchOrderAvailability(token)
    if (!availability)
      return { success: false, errorCode: "availability_unavailable" }
    if (!availability.managedLink || !availability.accessGranted)
      return { success: false, errorCode: "access_required" }
  }

  return saveOrder(parsed.data, token)
}
