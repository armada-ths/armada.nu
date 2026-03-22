import { ArrowRight } from "lucide-react"

import { HighlightCard } from "@/components/highlight-card"
import { Button } from "@/components/ui/button"

interface Hero1Props {
  badge?: string
  heading: string
  description: string
  buttons?: {
    primary?: {
      text: string
      url: string
    }
    secondary?: {
      text: string
      url: string
    }
  }
}

const Hero1 = ({
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
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
    <section className="pt-20">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="font-bebas-neue text-melon-700 text-5xl lg:text-7xl">
              {heading}
            </h1>
            <p className="text mb-8 max-w-xl lg:text-lg">{description}</p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button
                  asChild
                  className="bg-grapefruit text-snow w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="neutral" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <HighlightCard
            title="Join the Operations Team"
            subtitle="Help deliver Armada 2026 behind the scenes"
            ctaText="Join Armada!"
            ctaUrl="/student/recruitment"
            description="The Operations Team powers the fair from planning to execution. Whether your strengths are logistics, event flow, service, communication, or on-site coordination, you'll help create a smooth experience for exhibitors, students, and partners. You'll collaborate across teams, solve real problems under pressure, and build the structure that makes Armada possible."
          />
        </div>
      </div>
    </section>
  )
}

export { Hero1 }

