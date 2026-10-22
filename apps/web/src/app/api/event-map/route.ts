import { env } from "@/env"
import { isShortMapLink, resolveEventMap } from "@/lib/eventMap"

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url")
  if (!url || url.length > 2048 || !isShortMapLink(url)) {
    return Response.json({ embedUrl: null }, { status: 400 })
  }
  try {
    const embedUrl = await resolveEventMap(
      url,
      env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
    )
    return Response.json(
      { embedUrl },
      {
        headers: {
          "Cache-Control": embedUrl ? "public, max-age=86400" : "no-store"
        }
      }
    )
  } catch {
    return Response.json({ embedUrl: null }, { status: 502 })
  }
}
