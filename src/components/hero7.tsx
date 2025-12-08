import { ArrowRight } from "lucide-react";

import { P } from "@/app/_components/Paragraph";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Hero1Props {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Hero1 = ({
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  buttons = {
    primary: {
      text: "Discover all components",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "View on GitHub",
      url: "https://www.shadcnblocks.com",
    },
  },
}: Hero1Props) => {
  return (
    <section className="pt-20">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bebas-neue text-melon-700">{heading}</h1>
            <p className="text mb-8 max-w-xl lg:text-lg">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto bg-grapefruit">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="neutral" className="w-full sm:w-auto ">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <Card
            className="
              relative sm:w-full h-96 
              bg-snow rounded-md 
              border-4 border-licorice 
              overflow-hidden flex flex-col p-0
            "
          >

            {/* Nautical Title Bar */}
            <div
              className="
                flex items-center gap-3 px-4 py-2 
                border-b-4 border-licorice 
                bg-melon-700 text-licorice z-10
              "
            >
              {/* Window dots */}
              <span className="w-3 h-3 bg-grapefruit rounded-full"></span>
              <span className="w-3 h-3 bg-pineapple rounded-full"></span>
              <span className="w-3 h-3 bg-emerald-700 rounded-full"></span>

              {/* Title with ship icon */}
              <div className="ml-3 flex items-center gap-2">
                <span className="font-bebas-neue text-xl tracking-wide">
                  ARMADA
                </span>
              </div>
            </div>

            {/* Subtle animated wave background */}
            <div className="absolute inset-0 opacity-[0.06] bg-[url('/waves.svg')] bg-coconut pointer-events-none"></div>

            {/* Foreground content */}
            <div className="relative z-10 px-4 sm:px-8 flex flex-col items-center text-center justify-center flex-1">
              <h1 className="text-3xl sm:text-4xl font-bebas-bold font-bold text-center text-licorice rounded-md">
                ARMADA 2025 HAS ENDED
              </h1>
              <h2 className="text-melon-700">
                Thank You to All Our Partners and Participants!
              </h2>
              <P className="text-sm">
                Armada 2025 was a huge success because of your energy, innovation, and commitment.
                We’re grateful to every company and student who made this fair possible and memorable.
                Together, we’re shaping the future of talent and industry!
                See you next year - let’s keep building!
              </P>
            </div>
          </Card>
        </div>
      </div>
    </section >
  );
};

export { Hero1 };
