import { NextResponse, type NextRequest } from "next/server"
import { hasOrderAccess } from "./lib/orders"

export function proxy(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("access")
  if (token === null) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.search = ""
  const response = NextResponse.redirect(url)
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
export const config = { matcher: "/" }
