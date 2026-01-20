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
}

export function ApplyButton({
    href,
    variant,
    size = "lg",
    className }: ApplyButtonProps) {
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        // Check if we should be disabled right now
        const checkDisabled = () => {
            const now = new Date()
            // Disable at midnight on January 21, 2026 (end of January 20)
            const disableDate = new Date(2026, 0, 21, 0, 0, 0) // Month is 0-indexed

            if (now >= disableDate) {
                setIsDisabled(true)
            }
        }

        checkDisabled()

        // Set up an interval to check every minute
        const interval = setInterval(checkDisabled, 60000)

        return () => clearInterval(interval)
    }, [])

    if (isDisabled) {
        return (
            <Button
                variant={variant}
                size={size}
                disabled
                className={className}>
                PG applications have closed
            </Button>
        )
    }

    return (
        <Button asChild variant={variant} size={size} className={className}>
            <Link href={href}>Apply to Armada!</Link>
        </Button>
    )
}
