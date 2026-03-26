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

export function ApplyButton({
    href,
    variant,
    size = "lg",
    className,
    startDate,
    endDate,
    tracking }: ApplyButtonProps) {
    const [isDisabled, setIsDisabled] = useState(false)
    const [disabledText, setDisabledText] = useState("Recruitment is closed")

    useEffect(() => {
        // Check if we should be disabled right now
        const checkDisabled = () => {
            const now = new Date()
            const parsedStartDate = startDate ? new Date(startDate) : null
            const parsedEndDate = endDate ? new Date(endDate) : null

            const hasValidStartDate =
                parsedStartDate != null && !Number.isNaN(parsedStartDate.getTime())
            const hasValidEndDate =
                parsedEndDate != null && !Number.isNaN(parsedEndDate.getTime())

            const isBeforeStart = hasValidStartDate && now < parsedStartDate
            const isAfterEnd = hasValidEndDate && now >= parsedEndDate

            if (isBeforeStart && parsedStartDate) {
                const formattedStartDate = parsedStartDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })

                setDisabledText(`Application opens on ${formattedStartDate}`)
                setIsDisabled(true)
                return
            }

            if (isAfterEnd) {
                setDisabledText("Recruitment is closed")
                setIsDisabled(true)
                return
            }

            setDisabledText("Recruitment is closed")
            setIsDisabled(false)
        }

        checkDisabled()

        // Set up an interval to check every minute
        const interval = setInterval(checkDisabled, 60000)

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
        <Button asChild variant={variant} size={size} className={className}>
            <Link
                href={href}
                onClick={tracking ? () => track(tracking.eventName, tracking.eventData) : undefined}>
                Apply to Armada!
            </Link>
        </Button>
    )
}
