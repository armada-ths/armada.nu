import { env } from "@order/env"
import { z } from "zod"
import type { OrderInput, OrderErrorCode } from "./orders"

const id = z.number().int().positive().safe()
const text = z.string().min(1)
const lineSchema = z.object({
  itemId: id,
  categoryId: id,
  itemName: text,
  itemNameSv: z.string().nullable().optional(),
  categoryName: text,
  categoryNameSv: z.string().nullable().optional(),
  quantity: id
})
export const acceptedOrderSchema = z.object({
  id,
  companyName: text,
  isTest: z.boolean(),
  status: z.enum(["pending", "completed", "cancelled"]),
  deliveryStatus: z.enum(["pending", "sending", "sent", "failed", "unknown"]),
  lines: z.array(lineSchema).min(1)
})
type AcceptedOrder = z.infer<typeof acceptedOrderSchema>
type DeliveryStatus = "sent" | "failed" | "unknown"
type CmsResult<T> =
  { success: true; data: T } | { success: false; errorCode: OrderErrorCode }
const cmsErrorSchema = z.object({
  errorCode: z.enum([
    "orders_closed",
    "invalid_order",
    "company_ineligible",
    "items_changed",
    "availability_unavailable"
  ])
})

export function isTestDeployment() {
  return process.env.VERCEL_ENV !== "production"
}

async function cmsMutation<T>(
  path: string,
  body: unknown,
  schema: z.ZodType<T>
): Promise<CmsResult<T>> {
  const secret = isTestDeployment()
    ? env.LOUNGE_ORDER_TEST_SUBMISSION_SECRET
    : env.LOUNGE_ORDER_SUBMISSION_SECRET
  if (
    !secret ||
    (isTestDeployment() && secret === env.LOUNGE_ORDER_SUBMISSION_SECRET)
  ) {
    console.error("Order CMS submission credentials are not configured")
    return { success: false, errorCode: "submission_failed" }
  }
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`
      },
      body: JSON.stringify(body),
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(10000)
    })
    const json: unknown = await response.json()
    if (!response.ok) {
      console.error("Order CMS mutation failed", {
        path,
        status: response.status
      })
      const error = cmsErrorSchema.safeParse(json)
      return {
        success: false,
        errorCode: error.success ? error.data.errorCode : "submission_failed"
      }
    }
    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      console.error("Order CMS mutation response is invalid", { path })
      return { success: false, errorCode: "submission_failed" }
    }
    return { success: true, data: parsed.data }
  } catch {
    console.error("Order CMS mutation unavailable", { path })
    return { success: false, errorCode: "submission_failed" }
  }
}

export async function saveOrder(input: OrderInput) {
  const result = await cmsMutation(
    "lounge-orders/submit",
    input,
    acceptedOrderSchema
  )
  if (result.success && result.data.isTest !== isTestDeployment()) {
    console.error("Order CMS returned a mismatched delivery environment")
    return { success: false, errorCode: "submission_failed" } as const
  }
  return result
}

function slackText(order: AcceptedOrder) {
  const plain = (value: string) =>
    value.replace(/[&<>]/g, character =>
      character === "&" ? "&amp;" : character === "<" ? "&lt;" : "&gt;"
    )
  const groups = new Map<number, { name: string; lines: string[] }>()
  for (const line of order.lines) {
    const group = groups.get(line.categoryId) ?? {
      name: plain(line.categoryName),
      lines: []
    }
    group.lines.push(`- ${plain(line.itemName)} x${line.quantity}`)
    groups.set(line.categoryId, group)
  }
  return `${order.isTest ? "[STAGING TEST] " : ""}Order #${order.id} for ${plain(order.companyName)}:\n${[...groups.values()].map(group => `${group.name}\n${group.lines.join("\n")}`).join("\n\n")}`
}

async function sendSlack(
  order: AcceptedOrder
): Promise<{ status: DeliveryStatus; error?: string }> {
  const webhook = order.isTest
    ? env.SLACK_ORDER_TEST_HOOK_URL
    : env.SLACK_ORDER_HOOK_URL
  let url: URL
  try {
    url = new URL(webhook)
  } catch {
    console.error("Order Slack delivery is not configured", {
      orderId: order.id
    })
    return { status: "failed", error: "not_configured" }
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== "hooks.slack.com" ||
    url.username ||
    url.password ||
    (order.isTest && webhook === env.SLACK_ORDER_HOOK_URL)
  ) {
    console.error("Order Slack delivery configuration is invalid", {
      orderId: order.id
    })
    return { status: "failed", error: "not_configured" }
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: slackText(order), mrkdwn: false }),
      redirect: "error",
      signal: AbortSignal.timeout(10000)
    })
    if (!response.ok) {
      console.error("Order Slack notification rejected", {
        orderId: order.id,
        status: response.status
      })
      return { status: "failed", error: "slack_rejected" }
    }
    return { status: "sent" }
  } catch {
    console.error("Order Slack notification outcome is unknown", {
      orderId: order.id
    })
    return { status: "unknown", error: "slack_timeout" }
  }
}

export async function deliverSavedOrder(orderId: number) {
  const claim = await cmsMutation(
    `lounge-orders/${orderId}/claim`,
    {},
    z.object({
      claimed: z.boolean(),
      claimToken: z.string().min(1).optional(),
      order: acceptedOrderSchema.optional()
    })
  )
  if (!claim.success) return { success: false, status: "unknown" } as const
  if (!claim.data.claimed)
    return { success: true, status: "unchanged" } as const
  const { order, claimToken } = claim.data
  if (
    !order ||
    !claimToken ||
    order.id !== orderId ||
    order.isTest !== isTestDeployment()
  ) {
    console.error("Order CMS returned an invalid delivery claim", { orderId })
    return { success: false, status: "unknown" } as const
  }
  const outcome = await sendSlack(order)
  const reported = await cmsMutation(
    `lounge-orders/${orderId}/delivery`,
    { claimToken, ...outcome },
    z.object({ success: z.literal(true) })
  )
  return { success: reported.success, status: outcome.status }
}
