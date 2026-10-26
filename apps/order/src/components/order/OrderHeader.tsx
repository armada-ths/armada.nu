"use client"
import { useLocale } from "next-intl"
import Link from "next/link"
import { LanguageSwitcher } from "@armada/shared/i18n/client"
export function OrderHeader() {
  const locale = useLocale()
  return (
    <header className="border-border flex items-center justify-between gap-4 border-b px-5 py-4">
      <Link
        href={"https://armada.nu/" + locale}
        className="font-bebas-neue text-melon text-3xl">
        THS Armada
      </Link>
      <LanguageSwitcher refresh={false} />
    </header>
  )
}
