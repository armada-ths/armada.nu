"use client"

import { usePathname } from "next/navigation"

export function FooterGuard({ children }: React.PropsWithChildren) {
  const pathname = usePathname()
  /**
   * Ugly workaround, but we don't want the footer to be rendered on the map page
   */
  if (pathname === "/student/map") return null
  return children
}
