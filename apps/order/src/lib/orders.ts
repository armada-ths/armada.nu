import { z } from "zod"
import type { OrderData } from "./catalogue"

export type OrderErrorCode =
  | "access_required"
  | "orders_closed"
  | "invalid_order"
  | "availability_unavailable"
  | "delivery_unavailable"
  | "delivery_failed"
  | "submission_failed"
  | "company_ineligible"
  | "items_changed"
export type OrderResult = {
  success: boolean
  orderId?: number
  error?: string
  errorCode?: OrderErrorCode
}
export const orderInputSchema = z.object({
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
export type OrderInput = z.infer<typeof orderInputSchema>
export type OrderDataResult =
  | { success: true; data: OrderData }
  | { success: false; errorCode: OrderErrorCode }

export function hasOrderAccess(
  cookie: string | undefined,
  secret: string | undefined
) {
  return Boolean(secret?.trim() && cookie === secret)
}
