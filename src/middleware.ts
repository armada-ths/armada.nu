import { NextRequest, NextResponse } from "next/server"

import { defaultLocale, normalizeLocale } from "@/lib/i18n"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const localeMatch = pathname.match(/^\/(en|sv)(?:\/|$)/i)
  const localeFromPath = localeMatch ? localeMatch[1].toLowerCase() : null
  const locale = normalizeLocale(
    localeFromPath ?? request.cookies.get("locale")?.value ?? defaultLocale
  )

  if (!localeFromPath) {
    const targetPath = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`
    const response = NextResponse.redirect(
      new URL(`${targetPath}${search}`, request.url)
    )
    response.cookies.set("locale", locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    })
    return response
  }

  if (localeFromPath && locale !== localeFromPath) {
    const correctedPath = pathname.replace(
      new RegExp(`^/${localeFromPath}`),
      `/${locale}`
    )
    return NextResponse.redirect(
      new URL(`${correctedPath}${search}`, request.url)
    )
  }

  const strippedPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/"
  const response = NextResponse.rewrite(
    new URL(strippedPath === "/" ? "/" : strippedPath, request.url)
  )

  response.cookies.set("locale", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  })

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"]
}
