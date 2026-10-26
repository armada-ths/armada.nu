import { NextResponse, type NextRequest } from "next/server"
import { localeProxy } from "@armada/shared/i18n/proxy"
import { hasOrderAccess } from "./lib/orders"

export function proxy(request: NextRequest) {
  const localized = localeProxy(request)
  const token = request.nextUrl.searchParams.get("access")
  if (token === null) return localized
  const url = new URL(localized.headers.get("location") ?? request.url)
  url.searchParams.delete("access")
  const response = NextResponse.redirect(url)
  for (const cookie of localized.cookies.getAll()) response.cookies.set(cookie)
  response.headers.set("Referrer-Policy", "no-referrer")
  response.headers.set("Cache-Control", "no-store")
  if (hasOrderAccess(token, process.env.EXPO_ACCESS_TOKEN)) {
    response.cookies.set("_ea", token, {
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    })
  }
  return response
}
export const config = { matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"] }
