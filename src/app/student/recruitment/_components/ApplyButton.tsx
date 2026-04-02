"use client"

import { TrackingConfig } from "@/components/shared/TrackedLink"
import { Button } from "@/components/ui/button"
import { track } from "@vercel/analytics"
import Link from "next/link"
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

function formatDeadlineCountdown(endDate: Date): string {
    const msLeft = endDate.getTime() - Date.now()
    if (msLeft <= 0) return ""
    const totalSeconds = Math.floor(msLeft / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    if (days > 3) return `${days} days left to apply`
    if (days > 0) return `${days}d ${hours}h ${minutes}m left to apply`
    if (hours > 0) return `${hours}h ${minutes}m left to apply`
    if (minutes > 0) return `${minutes}m ${seconds}s left to apply`
    return `${seconds}s left to apply`
}

export function ApplyButton({
    href,
    variant,
    size = "lg",
    className,
    mobile,
    startDate,
    endDate,
    tracking }: ApplyButtonProps) {
    const [isDisabled, setIsDisabled] = useState(false)
    const [disabledText, setDisabledText] = useState("Recruitment is closed")
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
                setDisabledText(`Application opens on ${formattedStartDate}`)
                setIsDisabled(true)
                setCountdown(null)
                return
            }

            if (isAfterEnd) {
                setDisabledText("Recruitment is closed")
                setIsDisabled(true)
                setCountdown(null)
                return
            }

            setIsDisabled(false)
            setCountdown(hasValidEndDate ? formatDeadlineCountdown(parsedEndDate!) : null)
        }

        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [startDate, endDate])

    if (isDisabled) {
        return (
            <Button
                variant={variant}
                size={size}
                disabled
                className={className}>
                {disabledText}
            </Button>
        )
    }

    return (
        <div className="flex flex-col items-center gap-1.5">
            <Button asChild variant={variant} size={size} className={className}>
                <Link
                    href={href}
                    onClick={tracking ? () => track(tracking.eventName, tracking.eventData) : undefined}>
                    Apply to Armada!
                </Link>
            </Button>
            {countdown && (
                <p className={mobile
                    ? "text-sm font-medium px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm"
                    : "text-sm text-muted-foreground"}>
                    {countdown}
                </p>
            )}
        </div>
    )
}
