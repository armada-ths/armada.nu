"use client"

import {
  ConfettiBurst,
  useCountdownAnimation
} from "@/app/_components/CountdownTimer"
import { DateTime } from "luxon"

interface CountdownProps {
  fairDays: string[]
}

export function Countdown({ fairDays }: CountdownProps) {
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
    <div className="relative mt-6 overflow-visible">
      {animationStage === "celebration" && <ConfettiBurst />}

      <p className="font-bebas-neue text-melon mb-1 text-2xl lg:text-3xl">
        {dateLabel}
      </p>

      {animationStage === "celebration" ? (
        <p className="font-bebas-neue text-melon animate-pulse text-xl tracking-wide">
          The Fair Is Live!
        </p>
      ) : (
        <div className="flex items-end justify-center gap-0 lg:justify-start">
          <Unit value={displayTime.days} label="Days" />
          <Divider />
          <Unit value={displayTime.hours} label="Hours" />
          <Divider />
          <Unit value={displayTime.minutes} label="Mins" />
          <Divider />
          <Unit value={displayTime.seconds} label="Secs" />
        </div>
      )}
    </div>
  )
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-3 text-center first:pl-0 lg:text-left">
      <p
        suppressHydrationWarning
        className="font-bebas-neue text-licorice text-3xl leading-none lg:text-4xl">
        {value}
      </p>
      <p className="font-bebas-neue text-licorice/50 text-xs tracking-widest uppercase">
        {label}
      </p>
    </div>
  )
}

function Divider() {
  return <span className="border-licorice/25 mb-4 h-7 border-l" />
}
