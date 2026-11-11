import { env } from "@order/env"
import { z } from "zod"
import type { OrderInput, OrderResult } from "./orders"

const acceptedOrderSchema = z.object({
  id: z.number().int().positive().safe(),
  isTest: z.boolean()
})
const cmsErrorSchema = z.object({
  errorCode: z.enum([
    "orders_closed",
    "invalid_order",
    "company_ineligible",
    "items_changed",
    "availability_unavailable"
  ])
})

export async function saveOrder(input: OrderInput): Promise<OrderResult> {
  const isTest = process.env.VERCEL_ENV !== "production"
  const secret = isTest
    ? env.LOUNGE_ORDER_TEST_SUBMISSION_SECRET
    : env.LOUNGE_ORDER_SUBMISSION_SECRET
  if (!secret || (isTest && secret === env.LOUNGE_ORDER_SUBMISSION_SECRET)) {
    console.error("Order CMS submission credentials are not configured")
    return { success: false, errorCode: "submission_failed" }
  }
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/lounge-orders/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`
        },
        body: JSON.stringify(input),
        redirect: "error",
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      }
    )
    const json: unknown = await response.json()
    if (!response.ok) {
      console.error("Order CMS mutation failed", {
        status: response.status
      })
      const error = cmsErrorSchema.safeParse(json)
      return {
        success: false,
        errorCode: error.success ? error.data.errorCode : "submission_failed"
      }
    }
    const parsed = acceptedOrderSchema.safeParse(json)
    if (!parsed.success) {
      console.error("Order CMS submission response is invalid")
      return { success: false, errorCode: "submission_failed" }
    }
    if (parsed.data.isTest !== isTest) {
      console.error("Order CMS returned a mismatched submission environment")
      return { success: false, errorCode: "submission_failed" }
    }
    return { success: true, orderId: parsed.data.id }
  } catch {
    console.error("Order CMS submission unavailable")
    return { success: false, errorCode: "submission_failed" }
  }
}
