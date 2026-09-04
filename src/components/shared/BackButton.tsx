"use client"

import { Button } from "@/components/ui/button"
import { getLocaleFromPathname } from "@/lib/i18n"
import { usePathname, useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()
  const locale = getLocaleFromPathname(usePathname())
  return (
    <Button variant="neutral" onClick={() => router.back()}>
      {locale === "sv" ? "Gå tillbaka" : "Go Back"}
    </Button>
  )
}
