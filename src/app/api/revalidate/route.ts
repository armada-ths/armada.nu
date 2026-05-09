import { env } from "@/env";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = (await request.json()) as { tag?: string; secret?: string }
    const { tag, secret } = body

    if (secret !== env.REVALIDATION_SECRET) {
        return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
    }

    if (!tag || typeof tag !== "string") {
        return NextResponse.json({ message: "Missing tag" }, { status: 400 })
    }

    revalidateTag(tag, { expire: 0 })
    return NextResponse.json({ revalidated: true, tag })
}
