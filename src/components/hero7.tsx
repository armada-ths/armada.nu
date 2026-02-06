import { ArrowRight } from "lucide-react"

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
          {/* <Card className="bg-snow border-licorice relative flex h-96 flex-col overflow-hidden rounded-md border-4 p-0 sm:w-full"> */}
          {/* Nautical Title Bar */}
          {/* <div className="border-licorice bg-melon-700 text-licorice z-10 flex items-center gap-3 border-b-4 px-4 py-2"> */}
          {/* Window dots */}
          {/* <span className="bg-grapefruit h-3 w-3 rounded-full"></span>
              <span className="bg-pineapple h-3 w-3 rounded-full"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-700"></span> */}

          {/* Title with ship icon */}
          {/* <div className="ml-3 flex items-center gap-2">
                <span className="font-bebas-neue text-xl tracking-wide">
                  ARMADA
                </span>
              </div>
            </div> */}

          {/* Subtle animated wave background */}
          {/* <div className="bg-coconut pointer-events-none absolute inset-0 bg-[url('/waves.svg')] opacity-[0.06]"></div> */}

          {/* Foreground content */}
          {/* <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-8">
              <h1 className="font-bebas-bold text-licorice rounded-md text-center text-3xl font-bold sm:text-4xl">
                Secure your future
              </h1>
              <h2 className="text-melon-700">
                Build real experience that sets you up for success -
                <a
                  href="/student/recruitment"
                  className="underline hover:no-underline">
                  Join PG26!
                </a>
              </h2>
              <P className="text-sm">
                The Project Group of Armada consists of around 15 members.
                Together we are the group that plan the fair, recruit other
                volunteers and sell to exhibitors. We are elected in February
                and work throughout the year to create the fair and events that
                help students find their dream employer.
              </P>
            </div>
          </Card> */}
        </div>
      </div>
    </section>
  )
}

export { Hero1 }

