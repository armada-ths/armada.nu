import { Link } from "@armada/shared/i18n/navigation"
import { TrackedLink, TrackingConfig } from "@/components/shared/TrackedLink"
import { NauticalCard } from "@/components/ui/nautical-card"
import ReactMarkdown from "react-markdown"

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
            <Link href={ctaUrl} className="underline hover:no-underline">
              {ctaText}
            </Link>
          ))}
      </h2>
      {description && (
        <div className="text-licorice mt-2 space-y-2 pb-3 text-sm">
          <ReactMarkdown
            skipHtml
            components={{
              a: ({ children, href }) =>
                href ? (
                  <Link href={href} className="underline hover:no-underline">
                    {children}
                  </Link>
                ) : (
                  children
                ),
              ul: ({ children }) => (
                <ul className="list-inside list-disc">{children}</ul>
              ),
              ol: ({ children, start }) => (
                <ol start={start} className="list-inside list-decimal">
                  {children}
                </ol>
              )
            }}>
            {description}
          </ReactMarkdown>
        </div>
      )}
    </NauticalCard>
  )
}

export { HighlightCard }
