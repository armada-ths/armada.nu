import { Card } from "@/components/ui/card"
import { ReactNode } from "react"

interface NauticalCardProps {
  brand?: string
  children: ReactNode
}

// Reusable card shell. Includes the melon title bar with colored dots, wave background, and content wrapper.

export function NauticalCard({
  brand = "ARMADA",
  children
}: NauticalCardProps) {
  return (
    <Card className="bg-snow border-licorice relative flex h-auto flex-col overflow-hidden rounded-md border-4 p-0 sm:w-full">
      {/* Nautical title bar */}
      <div className="border-licorice bg-melon text-licorice z-10 flex items-center gap-3 border-b-4 px-4 py-2">
        {/* Window dots */}
        <span className="bg-grapefruit h-3 w-3 rounded-full" />
        <span className="bg-pineapple h-3 w-3 rounded-full" />
        <span className="h-3 w-3 rounded-full bg-emerald-700" />

        {/* Brand */}
        <div className="ml-3 flex items-center gap-2">
          <span className="font-bebas-neue text-xl tracking-wide">{brand}</span>
        </div>
      </div>

      {/* Subtle animated wave background */}
      <div className="bg-coconut pointer-events-none absolute inset-0 bg-[url('/waves.svg')] opacity-[0.06]" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-6 text-center sm:px-8">
        {children}
      </div>
    </Card>
  )
}
