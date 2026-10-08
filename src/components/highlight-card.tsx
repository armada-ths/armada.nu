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

// Inner highlight-card content, reusable without the NauticalCard window shell.
const HighlightCardContent = ({
  title,
  subtitle,
  ctaText,
  ctaUrl,
  ctaTracking,
  description
}: Omit<HighlightCardProps, "brand">) => {
  const hasLink = ctaText && ctaUrl
  return (
    <>
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
    </>
  )
}

const HighlightCard = ({ brand = "ARMADA", ...rest }: HighlightCardProps) => {
  return (
    <NauticalCard brand={brand}>
      <HighlightCardContent {...rest} />
    </NauticalCard>
  )
}

export { HighlightCard, HighlightCardContent }
