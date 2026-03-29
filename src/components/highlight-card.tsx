import { P } from "@/app/_components/Paragraph"
import { TrackedLink, TrackingConfig } from "@/components/shared/TrackedLink"
import { Card } from "@/components/ui/card"

interface HighlightCardProps {
    brand?: string
    title: string
    subtitle: string
    ctaText: string
    ctaUrl: string
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
    return (
        <Card className="bg-snow border-licorice relative flex h-auto min-h-96 flex-col overflow-hidden rounded-md border-4 p-0 sm:w-full">
            {/* Nautical Title Bar */}
            <div className="border-licorice bg-melon-700 text-licorice z-10 flex items-center gap-3 border-b-4 px-4 py-2">
                {/* Window dots */}
                <span className="bg-grapefruit h-3 w-3 rounded-full"></span>
                <span className="bg-pineapple h-3 w-3 rounded-full"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-700"></span>

                {/* Brand */}
                <div className="ml-3 flex items-center gap-2">
                    <span className="font-bebas-neue text-xl tracking-wide">{brand}</span>
                </div>
            </div>

            {/* Subtle animated wave background */}
            <div className="bg-coconut pointer-events-none absolute inset-0 bg-[url('/waves.svg')] opacity-[0.06]" />

            {/* Foreground content */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-8">
                <h1 className="font-bebas-bold text-licorice rounded-md text-center text-3xl font-bold sm:text-4xl">
                    {title}
                </h1>
                <h2 className="text-melon-700">
                    {subtitle} -{" "}
                    {ctaTracking ? (
                        <TrackedLink href={ctaUrl} tracking={ctaTracking} className="underline hover:no-underline">
                            {ctaText}
                        </TrackedLink>
                    ) : (
                        <a href={ctaUrl} className="underline hover:no-underline">
                            {ctaText}
                        </a>
                    )}
                </h2>
                <P className="text-sm pb-3">{description}</P>
            </div>
        </Card>
    )
}

export { HighlightCard }
