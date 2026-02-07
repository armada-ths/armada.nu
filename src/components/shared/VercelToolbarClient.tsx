"use client"

import { VercelToolbar } from "@vercel/toolbar/next"
import { FlagValues } from "flags/react"

interface DevToolbarClientProps {
    featureFlags: Record<string, unknown>
}

export function DevToolbarClient({ featureFlags }: DevToolbarClientProps) {
    return (
        <>
            <FlagValues values={featureFlags} />
            {process.env.NODE_ENV === "development" && <VercelToolbar />}
        </>
    )
}
