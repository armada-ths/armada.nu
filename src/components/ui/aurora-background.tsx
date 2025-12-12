"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  showRadialGradient?: boolean
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden",
        className
      )}
      {...props}>
      {/* BRAND AURORA LAYER */}
      <div
        className="animate-aurora pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light blur-xl"
        style={
          {
            "--aurora": `
              repeating-linear-gradient(
                130deg,
                rgba(72,188,142,0.40) 0%,   /* MELON */
                rgba(255,255,255,0.20) 40%, /* SNOW */
                rgba(45,45,44,0.14) 50%     /* LICORICE depth */
              )
            `,
            "--highlight": `
              repeating-linear-gradient(
                115deg,
                rgba(255,255,255,0.18) 0%,
                rgba(255,255,255,0.10) 8%,
                transparent 14%,
                transparent 18%,
                rgba(255,255,255,0.16) 24%
              )
            `
          } as React.CSSProperties
        }>
        <div
          className={cn(
            `after:animate-aurora absolute -inset-[25px] [background-image:var(--highlight),var(--aurora)] bg-size-[300%,200%] bg-position-[50%_50%,50%_50%] opacity-90 mix-blend-screen blur-[22px] will-change-transform`,
            showRadialGradient &&
              "mask-[radial-gradient(ellipse_at_70%_0%,black_25%,transparent_75%)]"
          )}
        />
      </div>

      {/* PAGE CONTENT */}
      {children}
    </div>
  )
}
