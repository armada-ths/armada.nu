"use client"

import { Button } from "@/components/ui/button"
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
}

export function ApplyButton({
    href,
    variant,
    size = "lg",
    className,
    startDate,
    endDate }: ApplyButtonProps) {
    const [isDisabled, setIsDisabled] = useState(false)

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

            setIsDisabled(isBeforeStart || isAfterEnd)
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
                Recruitment is closed
            </Button>
        )
    }

    return (
        <Button asChild variant={variant} size={size} className={className}>
            <Link href={href}>Apply to Armada!</Link>
        </Button>
    )
}
