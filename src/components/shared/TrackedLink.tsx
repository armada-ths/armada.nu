"use client"

import { track } from "@vercel/analytics"
import Link from "next/link"
import { ComponentPropsWithoutRef, forwardRef } from "react"

export type TrackingConfig = {
    eventName: string
    eventData?: Record<string, string | number | boolean | null>
}

interface TrackedLinkProps extends ComponentPropsWithoutRef<typeof Link> {
    tracking: TrackingConfig
}

const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
    ({ tracking, onClick, ...props }, ref) => {
        return (
            <Link
                ref={ref}
                onClick={e => {
                    track(tracking.eventName, tracking.eventData)
                    onClick?.(e)
                }}
                {...props}
            />
        )
    }
)

TrackedLink.displayName = "TrackedLink"

export { TrackedLink }
