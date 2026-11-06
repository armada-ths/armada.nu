"use client"
import { uiText } from "@/i18n/ui"

import { useLocale } from "@armada/shared/i18n/client"
import { normalizeLocale } from "@armada/shared/i18n/routing"

import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()
  const locale = normalizeLocale(useLocale())
  return (
    <Button variant="neutral" onClick={() => router.back()}>
      {uiText(locale, "goBack")}
    </Button>
  )
}
