import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()
  const host = (
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    ""
  )
    .split(":")[0]
    .toLowerCase()

  if (host === "photos.armada.nu") {
    const alreadyInternal =
      url.pathname === "/photos" || url.pathname.startsWith("/photos/")
    if (!alreadyInternal) {
      url.pathname = `/photos${url.pathname === "/" ? "" : url.pathname}`
    }
    const response = alreadyInternal
      ? NextResponse.next()
      : NextResponse.rewrite(url)
    response.headers.set("Referrer-Policy", "no-referrer")
    return response
  }

  if (url.pathname === "/photos" || url.pathname.startsWith("/photos/")) {
    const response = NextResponse.next()
    response.headers.set("Referrer-Policy", "no-referrer")
    return response
  }

  if (!url.pathname.startsWith("/exhibitor/order")) return NextResponse.next()
  const token = url.searchParams.get("access")
  const cookie = req.cookies.get("_ea")?.value
  const SECRET = process.env.EXPO_ACCESS_TOKEN

  if (token && token === SECRET) {
    const res = NextResponse.redirect(`${url.origin}${url.pathname}`)
    res.cookies.set({
      name: "_ea",
      value: SECRET,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax"
    })
    return res
  }

  if (cookie === SECRET) return NextResponse.next()

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|icons|favicon.ico|robots.txt|sitemap.xml).*)"
  ]
}
