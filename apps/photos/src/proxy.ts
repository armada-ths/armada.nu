export { localeProxy as proxy } from "@armada/shared/i18n/proxy"
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|local-photo-storage|.*\\..*).*)",
    "/e/:token",
    "/en/e/:token",
    "/sv/e/:token"
  ]
}
