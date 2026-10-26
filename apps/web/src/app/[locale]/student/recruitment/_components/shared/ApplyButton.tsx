"use client"
import { uiText } from "@/i18n/ui"

import { useLocale } from "@armada/shared/i18n/client"
import { normalizeLocale } from "@armada/shared/i18n/routing"

import { TrackingConfig } from "@/components/shared/TrackedLink"
import { Button } from "@/components/ui/button"
import { type Locale } from "@/lib/i18n"
import { track } from "@vercel/analytics"
import { Link } from "@armada/shared/i18n/navigation"

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
  const suffix = uiText(locale, "leftToApply")
  if (days > 3) return uiText(locale, "daysDaysSuffix", { days, suffix })
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
  const locale = normalizeLocale(useLocale())
  const [isDisabled, setIsDisabled] = useState(false)
  const [disabledText, setDisabledText] = useState(
    uiText(locale, "recruitmentIsClosed")
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
        const formattedStartDate = parsedStartDate.toLocaleDateString(
          locale === "sv" ? "sv-SE" : "en-GB",
          {
            timeZone: "Europe/Stockholm",
            day: "numeric",
            month: "long",
            year: "numeric"
          }
        )
        setDisabledText(
          uiText(locale, "applicationOpensOnFormattedStartDate", {
            formattedStartDate
          })
        )
        setIsDisabled(true)
        setCountdown(null)
        return
      }

      if (isAfterEnd) {
        setDisabledText(uiText(locale, "recruitmentIsClosed"))
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
          {uiText(locale, "applyToArmada")}
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
