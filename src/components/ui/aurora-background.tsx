"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
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
      {...props}
    >
      {/* Outer animated gradient */}
      <div
        className="absolute inset-0 animate-aurora opacity-[0.45] blur-[18px] mix-blend-soft-light"
        style={
          {
            "--aurora": `
              repeating-linear-gradient(
                115deg,
                rgba(6,95,70,0.35) 10%,      /* emerald-700 */
                rgba(16,185,129,0.28) 15%,   /* emerald-500 */
                rgba(52,211,153,0.22) 20%,   /* emerald-400 */
                rgba(110,231,183,0.18) 25%,  /* emerald-300 */
                rgba(167,243,208,0.14) 30%   /* mint/emerald-200 */
              )
            `,
            "--highlight": `
              repeating-linear-gradient(
                115deg,
                rgba(255,255,255,0.10) 0%,
                rgba(255,255,255,0.08) 7%,
                transparent 10%,
                transparent 12%,
                rgba(255,255,255,0.10) 16%
              )
            `
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            `absolute -inset-[20px]
            [background-image:var(--highlight),var(--aurora)]
            bg-size-[260%,200%]
            bg-position-[50%_50%,50%_50%]
            opacity-[0.85]
            blur-[20px]
            mix-blend-screen
            will-change-transform
            animate-[aurora_18s_ease-in-out_infinite]`,

            showRadialGradient &&
            "mask-[radial-gradient(ellipse_at_70%_0%,black_25%,transparent_80%)]"
          )}
        />
      </div>

      {children}
    </div>
  );
};

declare global {
  interface HTMLElementTagNameMap {
    "aurora-background": HTMLElement;
  }
}
