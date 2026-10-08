"use client"

import {
  ConfettiBurst,
  useCountdownAnimation
} from "@/app/_components/CountdownTimer"
import { NauticalCard } from "@/components/ui/nautical-card"
import { cn } from "@/lib/utils"
import { DateTime } from "luxon"

interface CountdownProps {
  fairDays: string[]
  centered?: boolean
}

type CountdownDisplayTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ fairDays, centered }: CountdownProps) {
  if (fairDays.length === 0) return null

  const startDt = DateTime.fromISO(fairDays[0], { zone: "Europe/Stockholm" })
  const endDt = DateTime.fromISO(fairDays[fairDays.length - 1], {
    zone: "Europe/Stockholm"
  })
  const showYear = endDt.year !== DateTime.now().year
  const targetDate = startDt.set({ hour: 10 }).toJSDate()

  const { displayTime, animationStage } = useCountdownAnimation(targetDate)

  const dateLabel = `${startDt.toFormat("d")}–${endDt.toFormat(`d MMM${showYear ? " yyyy" : ""}`)}`

  return (
    <div
      className={cn("relative overflow-visible", centered ? "w-full" : "mt-6")}>
      {animationStage === "celebration" && <ConfettiBurst />}

      <p
        className={cn(
          "font-bebas-neue text-melon mb-1 text-center",
          centered ? "text-2xl sm:text-3xl md:text-4xl" : "text-2xl lg:text-3xl"
        )}>
        {dateLabel} | Nymble, KTH
      </p>

      {animationStage === "celebration" ? (
        <div className="relative">
          <div aria-hidden className="invisible">
            <CountdownUnits
              displayTime={{ days: 0, hours: 0, minutes: 0, seconds: 0 }}
              centered={centered}
            />
          </div>
          <p
            className={cn(
              "font-bebas-neue text-melon absolute inset-x-0 top-0 flex animate-pulse items-start justify-center tracking-wide",
              centered
                ? "text-2xl sm:text-3xl md:text-4xl"
                : "text-xl lg:justify-start"
            )}>
            The Fair Is Live!
          </p>
        </div>
      ) : (
        <CountdownUnits displayTime={displayTime} centered={centered} />
      )}
    </div>
  )
}

function CountdownUnits({
  displayTime,
  centered
}: {
  displayTime: CountdownDisplayTime
  centered?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-end justify-center",
        centered ? "w-full" : "gap-0 lg:justify-start"
      )}>
      <Unit value={displayTime.days} label="Days" centered={centered} />
      <Divider centered={centered} />
      <Unit value={displayTime.hours} label="Hours" centered={centered} />
      <Divider centered={centered} />
      <Unit value={displayTime.minutes} label="Mins" centered={centered} />
      <Divider centered={centered} />
      <Unit value={displayTime.seconds} label="Secs" centered={centered} />
    </div>
  )
}

function Unit({
  value,
  label,
  centered
}: {
  value: number
  label: string
  centered?: boolean
}) {
  return (
    <div
      className={cn(
        "text-center",
        centered ? "flex-1" : "px-3 first:pl-0 lg:text-left"
      )}>
      <p
        suppressHydrationWarning
        className={cn(
          "font-bebas-neue text-licorice leading-none",
          centered ? "text-4xl sm:text-5xl md:text-6xl" : "text-3xl lg:text-4xl"
        )}>
        {value}
      </p>
      <p
        className={cn(
          "font-bebas-neue text-licorice/50 tracking-widest uppercase",
          centered ? "text-xs sm:text-sm" : "text-xs"
        )}>
        {label}
      </p>
    </div>
  )
}

function Divider({ centered }: { centered?: boolean }) {
  return (
    <span
      className={cn(
        "border-licorice/25 border-l",
        centered ? "mb-4 h-9 sm:h-11 md:h-13" : "mb-4 h-7"
      )}
    />
  )
}

// Countdown wrapped in the same nautical-card shell as HighlightCard,
// used as sideContent in the hero when no highlight card is available.
export function CountdownCard({ fairDays }: CountdownProps) {
  return (
    <NauticalCard>
      <Countdown fairDays={fairDays} centered />
    </NauticalCard>
  )
}
