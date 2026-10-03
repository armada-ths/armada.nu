import { P } from "@/app/_components/Paragraph"
import { TrackedLink, TrackingConfig } from "@/components/shared/TrackedLink"
import { NauticalCard } from "@/components/ui/nautical-card"

interface HighlightCardProps {
  brand?: string
  title: string
  subtitle: string
  ctaText?: string
  ctaUrl?: string
  ctaTracking?: TrackingConfig
  description: string
}

const HighlightCard = ({
  brand = "ARMADA",
  title,
  subtitle,
  ctaText,
  ctaUrl,
  ctaTracking,
  description
}: HighlightCardProps) => {
  const hasLink = ctaText && ctaUrl
  return (
    <NauticalCard brand={brand}>
      <h1 className="font-bebas-bold text-licorice rounded-md text-center text-3xl font-bold sm:text-4xl">
        {title}
      </h1>
      <h2 className="text-melon">
        {subtitle}
        {hasLink && " - "}
        {hasLink &&
          (ctaTracking ? (
            <TrackedLink
              href={ctaUrl}
              tracking={ctaTracking}
              className="underline hover:no-underline">
              {ctaText}
            </TrackedLink>
          ) : (
            <a href={ctaUrl} className="underline hover:no-underline">
              {ctaText}
            </a>
          ))}
      </h2>
      <P className="pb-3 text-sm">{description}</P>
    </NauticalCard>
  )
}

export { HighlightCard }
