import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function BadgeCollection({
  items,
  maxDisplayed = Infinity,
  className,
  badgeClassName,
  maxChars = 35, // 👈 tweak this for cutoff length
}: {
  items: { id: number; name: string }[]
  maxDisplayed?: number
  className?: string
  badgeClassName?: string
  maxChars?: number
}) {
  const tooltip = items
    .slice(maxDisplayed)
    .map(ind => ind.name)
    .join(", ")

  const truncate = (text: string) =>
    text.length > maxChars ? text.slice(0, maxChars).trimEnd() + "…" : text

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.slice(0, maxDisplayed).map(({ id, name }) => (
        <Badge
          key={id}
          variant="square"
          title={name} // full name on hover
          className={cn(
            "w-max flex-none shadow-lg px-2 py-1 text-sm font-medium",
            badgeClassName
          )}
        >
          {truncate(name)}
        </Badge>
      ))}
      {items.length > maxDisplayed && (
        <Badge
          variant="square"
          title={tooltip}
          className={cn("w-max shadow-lg flex-none", badgeClassName)}
        >
          +{items.length - maxDisplayed}
        </Badge>
      )}
    </div>
  )
}
