"use client"

import { TrackingConfig } from "@/components/shared/TrackedLink"
import { Button } from "@/components/ui/button"
import { getLocaleFromPathname, type Locale } from "@/lib/i18n"
import { track } from "@vercel/analytics"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface ApplyButtonProps {
  href: string
  variant?: "default" | "reverse" | "noShadow" | "neutral"
  size?: "default" | "lg" | "sm" | "icon"
  className?: string
  mobile?: boolean
  startDate?: string
  endDate?: string
  tracking?: TrackingConfig
}

function formatDeadlineCountdown(endDate: Date, locale: Locale): string {
  const msLeft = endDate.getTime() - Date.now()
  if (msLeft <= 0) return ""
  const totalSeconds = Math.floor(msLeft / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const suffix = locale === "sv" ? "kvar att ansöka" : "left to apply"
  if (days > 3)
    return locale === "sv"
      ? `${days} dagar ${suffix}`
      : `${days} days ${suffix}`
  if (days > 0) return `${days}d ${hours}h ${minutes}m ${suffix}`
  if (hours > 0) return `${hours}h ${minutes}m ${suffix}`
  if (minutes > 0) return `${minutes}m ${seconds}s ${suffix}`
  return `${seconds}s ${suffix}`
}

export function ApplyButton({
  href,
  variant,
  size = "lg",
  className,
  mobile,
  startDate,
  endDate,
  tracking
}: ApplyButtonProps) {
  const locale = getLocaleFromPathname(usePathname())
  const [isDisabled, setIsDisabled] = useState(false)
  const [disabledText, setDisabledText] = useState(
    locale === "sv" ? "Rekryteringen är stängd" : "Recruitment is closed"
  )
  const [countdown, setCountdown] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const parsedStartDate = startDate ? new Date(startDate) : null
      const parsedEndDate = endDate ? new Date(endDate) : null

      const hasValidStartDate =
        parsedStartDate != null && !Number.isNaN(parsedStartDate.getTime())
      const hasValidEndDate =
        parsedEndDate != null && !Number.isNaN(parsedEndDate.getTime())

      const isBeforeStart = hasValidStartDate && now < parsedStartDate!
      const isAfterEnd = hasValidEndDate && now >= parsedEndDate!

      if (isBeforeStart && parsedStartDate) {
        const formattedStartDate = parsedStartDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
        setDisabledText(
          locale === "sv"
            ? `Ansökan öppnar ${formattedStartDate}`
            : `Application opens on ${formattedStartDate}`
        )
        setIsDisabled(true)
        setCountdown(null)
        return
      }

      if (isAfterEnd) {
        setDisabledText(
          locale === "sv" ? "Rekryteringen är stängd" : "Recruitment is closed"
        )
        setIsDisabled(true)
        setCountdown(null)
        return
      }

      setIsDisabled(false)
      setCountdown(
        hasValidEndDate ? formatDeadlineCountdown(parsedEndDate!, locale) : null
      )
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [startDate, endDate, locale])

  if (isDisabled) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        {disabledText}
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <Button asChild variant={variant} size={size} className={className}>
        <Link
          href={href}
          onClick={
            tracking
              ? () => track(tracking.eventName, tracking.eventData)
              : undefined
          }>
          {locale === "sv" ? "Ansök till Armada!" : "Apply to Armada!"}
        </Link>
      </Button>
      {countdown && (
        <p
          className={
            mobile
              ? "text-snow rounded-full bg-black/60 px-3 py-1 text-sm font-medium backdrop-blur-sm"
              : "text-muted-foreground text-sm"
          }>
          {countdown}
        </p>
      )}
    </div>
  )
}
