"use client"

import { useEffect, useState } from "react"

interface RecruitmentRollingBannerProps {
  endDate: string
  defaultVisible?: boolean
}

const SEGMENT_COUNT = 8

function formatTimeLeft(endDate: Date): string {
  const msLeft = endDate.getTime() - Date.now()
  if (msLeft <= 0) return "OT APPLICATIONS ARE CLOSED"
  const totalSeconds = Math.floor(msLeft / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (days > 3) return `OT APPLICATIONS CLOSES IN ${days} DAY${days !== 1 ? "S" : ""}`
  if (days > 0) return `OT APPLICATIONS CLOSES IN ${days}D ${hours}H ${minutes}M`
  if (hours > 0) return `OT APPLICATIONS CLOSES IN ${hours}H ${minutes}M`
  if (minutes > 0) return `OT APPLICATIONS CLOSES IN ${minutes}M ${seconds}S`
  return `OT APPLICATIONS CLOSES IN ${seconds}S`
}

export function RecruitmentRollingBanner({
  endDate,
  defaultVisible
}: RecruitmentRollingBannerProps) {
  const parsedEnd = new Date(endDate)
  const [label, setLabel] = useState(() => formatTimeLeft(parsedEnd))

  useEffect(() => {
    const interval = setInterval(() => {
      setLabel(formatTimeLeft(parsedEnd))
    }, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  if (!defaultVisible) return null

  const segments = Array(SEGMENT_COUNT).fill(label)
  const doubled = [...segments, ...segments]

  return (
    <section className="bg-grapefruit border-licorice -mt-1 flex h-14 w-full items-center overflow-hidden border-b px-4">
      <div
        className="animate-scroll flex will-change-transform"
        style={{ animationDuration: "30s" }}>
        {doubled.map((text, i) => (
          <span
            key={i}
            className="mx-10 shrink-0 whitespace-nowrap text-sm font-bold tracking-widest">
            {text}
          </span>
        ))}
      </div>
    </section>
  )
}
