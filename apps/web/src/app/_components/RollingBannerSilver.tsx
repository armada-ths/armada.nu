"use client"

import { useShuffledItems } from "@/components/shared/hooks/useShuffledItems"
import { Page } from "@/components/shared/Page"
import Image from "next/image"

interface RollingBannerProps {
  logos: string[]
}

function RollingRow({
  logos,
  duration = 30,
  reverse = false
}: {
  logos: string[]
  duration?: number
  reverse?: boolean
}) {
  const duplicated = [...logos, ...logos] // or triple if short
  const animationClass = reverse ? "animate-scroll-reverse" : "animate-scroll"

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className={`flex min-w-max ${animationClass} will-change-transform`}
        style={{
          animationDuration: `${duration}s`,
          transform: "translateZ(0)"
        }}>
        {duplicated.map((logo, index) => (
          <div key={index} className="mx-12 shrink-0">
            <Image
              src={logo}
              alt={`Logo ${index + 1}`}
              width={0}
              height={0}
              sizes="100vw"
              className="h-12 w-auto object-contain sm:h-14 md:h-16"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RollingBanner({ logos }: RollingBannerProps) {
  const shuffledLogos = useShuffledItems(logos)
  const orderedLogos = shuffledLogos ?? logos
  const perRow = Math.ceil(orderedLogos.length / 3)
  const row1 = orderedLogos.slice(0, perRow)
  const row2 = orderedLogos.slice(perRow, perRow * 2)
  const row3 = orderedLogos.slice(perRow * 2)

  return (
    <section className="bg-silver border-licorice relative right-1/2 left-1/2 mx-[-50vw] my-4 w-screen max-w-none overflow-y-visible border-y-2 border-solid pt-8 pb-12">
      <Page.Header
        tier="secondary"
        className="text-licorice mx-auto mb-8 w-fit px-6 py-2 text-center text-3xl tracking-wide sm:text-4xl">
        Silver Exhibitors
      </Page.Header>

      <div className={`space-y-10 ${shuffledLogos ? "" : "invisible"}`}>
        <RollingRow logos={row1} duration={25} />
        <RollingRow logos={row2} duration={35} reverse />
        <RollingRow logos={row3} duration={28} />
      </div>
    </section>
  )
}
