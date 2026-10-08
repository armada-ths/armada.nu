import { ArrowRight } from "lucide-react"
import { ReactNode } from "react"

import { TrackedLink, TrackingConfig } from "@/components/shared/TrackedLink"
import { Button } from "@/components/ui/button"
import { NauticalCard } from "@/components/ui/nautical-card"

interface Hero1Props {
  heading: string
  description: string
  bottomContent?: ReactNode
  buttons?: {
    primary?: {
      text: string
      url: string
      tracking?: TrackingConfig
    }
    secondary?: {
      text: string
      url: string
      tracking?: TrackingConfig
    }
  }
}

const Hero1 = ({
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  bottomContent,
  buttons = {
    primary: {
      text: "Discover all components",
      url: "https://www.shadcnblocks.com"
    },
    secondary: {
      text: "View on GitHub",
      url: "https://www.shadcnblocks.com"
    }
  }
}: Hero1Props) => {
  return (
    <section className="py-20">
      <div className="container flex justify-center lg:justify-start">
        <div className="w-full max-w-md">
          <NauticalCard>
            <h1 className="font-bebas-neue text-melon text-5xl lg:text-7xl">
              {heading}
            </h1>
            <p className="text mb-4 max-w-xl lg:text-lg">{description}</p>
            <div className="mb-4 flex w-full flex-col justify-center gap-2 sm:flex-row">
              {buttons.primary && (
                <Button
                  asChild
                  className="bg-grapefruit text-snow mb-6 w-full sm:w-auto">
                  {buttons.primary.tracking ? (
                    <TrackedLink
                      href={buttons.primary.url}
                      tracking={buttons.primary.tracking}>
                      {buttons.primary.text}
                    </TrackedLink>
                  ) : (
                    <a href={buttons.primary.url}>{buttons.primary.text}</a>
                  )}
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="neutral" className="w-full sm:w-auto">
                  {buttons.secondary.tracking ? (
                    <TrackedLink
                      href={buttons.secondary.url}
                      tracking={buttons.secondary.tracking}>
                      {buttons.secondary.text}
                      <ArrowRight className="size-4" />
                    </TrackedLink>
                  ) : (
                    <a href={buttons.secondary.url}>
                      {buttons.secondary.text}
                      <ArrowRight className="size-4" />
                    </a>
                  )}
                </Button>
              )}
            </div>
            {bottomContent}
          </NauticalCard>
        </div>
      </div>
    </section>
  )
}

export { Hero1 }
