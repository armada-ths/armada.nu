import { timingSafeEqual } from "node:crypto"
import { env } from "@order/env"
import { deliverSavedOrder, isTestDeployment } from "@order/lib/delivery"
import { z } from "zod"

export async function POST(request: Request) {
  const expected = env.ORDER_INTERNAL_SECRET
  const supplied = request.headers.get("authorization") ?? ""
  const authorization = `Bearer ${expected}`
  if (
    !expected ||
    Buffer.byteLength(supplied) !== Buffer.byteLength(authorization) ||
    !timingSafeEqual(Buffer.from(supplied), Buffer.from(authorization))
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await request.text()
  if (body.length > 1024)
    return Response.json({ error: "Request too large" }, { status: 413 })
  let json: unknown
  try {
    json = JSON.parse(body)
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }
  const parsed = z
    .object({
      orderId: z.number().int().positive().safe(),
      isTest: z.boolean()
    })
    .safeParse(json)
  if (!parsed.success || parsed.data.isTest !== isTestDeployment())
    return Response.json(
      { error: "Invalid delivery environment" },
      { status: 400 }
    )
  const result = await deliverSavedOrder(parsed.data.orderId, true)
  return Response.json(result, { status: result.success ? 200 : 502 })
}
