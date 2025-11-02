"use server"
import { env } from "@/env"
import { z } from "zod"

const ContactSalesSlackSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  message: z.string()
})

export async function sendToSlack(
  args: z.infer<typeof ContactSalesSlackSchema>
) {
  const result = ContactSalesSlackSchema.safeParse(args)
  if (!result.success) {
    return { success: false }
  }
  const msg = {
    text: `
        # New External Contact Message #\n*Name:* ${args.name}\n*Email:* ${args.email}\n*Phone Number:* ${args.phone}\n*Company:* ${args.company}\n*Description:*\n${args.message
        .split("\n")
        .map(line => `>${line}`)
        .join("\n")}\n`
  }
  try {
    if (typeof env.SLACK_SALES_HOOK_URL !== "string") {
      throw new Error("SLACK_SALES_HOOK_URL must be a string")
    }
    await fetch(env.SLACK_SALES_HOOK_URL, {
      method: "POST",
      body: JSON.stringify(msg),
      headers: {
        "Content-Type": "application/json"
      }
    })
    return { success: true }
  } catch (e) {
    console.warn(e)
    return { success: false }
  }
}

export async function sendOrderToSlack(
  message: string
): Promise<{ success: boolean; error?: string }> {
  const url = env.SLACK_ORDER_HOOK_URL
  if (!url) {
    return { success: false, error: "Missing SLACK_ORDER_HOOK_URL" }
  }

  try {
    new URL(url)
  } catch {
    return { success: false, error: "Invalid SLACK_ORDER_HOOK_URL" }
  }

  const payload = { text: message }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      return { success: false, error: `Slack error ${res.status}: ${body}` }
    }

    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error)?.message || "Network error" }
  }
}