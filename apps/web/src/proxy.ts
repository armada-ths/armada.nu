import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { defaultLocale, normalizeLocale } from "@/lib/i18n"

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const localeMatch = pathname.match(/^\/(en|sv)(?:\/|$)/i)
  const localeFromPath = localeMatch ? localeMatch[1].toLowerCase() : null
  const locale = normalizeLocale(
    localeFromPath ?? req.cookies.get("locale")?.value ?? defaultLocale
  )
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-armada-locale", locale)

  if (!localeFromPath) {
    const targetPath = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`
    const response = NextResponse.redirect(
      new URL(`${targetPath}${search}`, req.url)
    )
    response.cookies.set("locale", locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    })
    return response
  }

  if (locale !== localeFromPath) {
    const correctedPath = pathname.replace(
      new RegExp(`^/${localeFromPath}`),
      `/${locale}`
    )
    return NextResponse.redirect(new URL(`${correctedPath}${search}`, req.url))
  }

  const strippedPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/"
  const response = NextResponse.rewrite(
    new URL(strippedPath === "/" ? "/" : strippedPath, req.url),
    {
      request: {
        headers: requestHeaders
      }
    }
  )

  response.cookies.set("locale", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  })

  return response
}
