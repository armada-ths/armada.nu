"use client"
import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "@armada/shared/i18n/navigation"
import { LanguageSwitcher, LocaleMetadata } from "@armada/shared/i18n/client"
export function PhotosHeader() {
  const locale = useLocale()
  return (
    <header className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-8">
      <a href={"https://armada.nu/" + locale} className="text-sm font-semibold">
        THS Armada
      </a>
      <LanguageSwitcher refresh={false} />
    </header>
  )
}
export function PhotosMetadata() {
  const pathname = usePathname(),
    t = useTranslations("Metadata"),
    photos = useTranslations("Photos")
  const privacy = pathname === "/privacy"
  const title = privacy ? photos("privacyTitle") : t("title"),
    description = privacy ? photos("privacyDescription") : t("description")
  return <LocaleMetadata title={title} description={description} />
}
