import { env } from "@/env"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  let body: { tag?: string; secret?: string }

  try {
    body = (await request.json()) as { tag?: string; secret?: string }
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const { tag, secret } = body
  const configuredSecret = env.REVALIDATION_SECRET.trim()

  if (!configuredSecret) {
    return NextResponse.json(
      { message: "Revalidation is not configured" },
      { status: 500 }
    )
  }

  if (
    typeof secret !== "string" ||
    !secret.trim() ||
    secret !== configuredSecret
  ) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  if (!tag || typeof tag !== "string") {
    return NextResponse.json({ message: "Missing tag" }, { status: 400 })
  }

  revalidateTag(tag, { expire: 0 })
  return NextResponse.json({ revalidated: true, tag })
}
