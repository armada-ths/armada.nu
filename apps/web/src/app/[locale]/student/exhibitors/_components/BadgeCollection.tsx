"use client"
import { useLocale } from "next-intl"
import { normalizeLocale, localizedText } from "@armada/shared/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function BadgeCollection({
  items,
  maxDisplayed = Infinity,
  className,
  badgeClassName,
  maxChars = 35 // 👈 tweak this for cutoff length
}: {
  items: { id: number; name: string; nameSv?: string | null }[]
  maxDisplayed?: number
  className?: string
  badgeClassName?: string
  maxChars?: number
}) {
  const locale = normalizeLocale(useLocale())
  const localizedItems = items.map(item => ({
    ...item,
    name: localizedText(locale, item.name, item.nameSv)
  }))
  const tooltip = localizedItems
    .slice(maxDisplayed)
    .map(ind => ind.name)
    .join(", ")

  const truncate = (text: string) =>
    text.length > maxChars ? text.slice(0, maxChars).trimEnd() + "…" : text

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {localizedItems.slice(0, maxDisplayed).map(({ id, name }) => (
        <Badge
          key={id}
          variant="neutral"
          title={name} // full name on hover
          className={cn(
            "w-max flex-none px-2 py-1 text-sm font-medium shadow-lg",
            badgeClassName
          )}>
          {truncate(name)}
        </Badge>
      ))}
      {items.length > maxDisplayed && (
        <Badge
          variant="neutral"
          title={tooltip}
          className={cn("w-max flex-none shadow-lg", badgeClassName)}>
          +{items.length - maxDisplayed}
        </Badge>
      )}
    </div>
  )
}
