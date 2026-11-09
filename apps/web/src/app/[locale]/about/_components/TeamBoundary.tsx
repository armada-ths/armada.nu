import { Page } from "@/components/shared/Page"
import type { ReactNode } from "react"

export function TeamBoundary({ children }: { children: ReactNode }) {
  return (
    <Page.Boundary className="@container" style={{ maxWidth: "63.5rem" }}>
      {/* Fit whole 14rem card columns with 1.5rem gaps inside the page insets. */}
      <div className="mx-auto w-full sm:max-w-56 sm:@min-[29.5rem]:max-w-118 sm:@min-[45rem]:max-w-180 sm:@min-[60.5rem]:max-w-242">
        {children}
      </div>
    </Page.Boundary>
  )
}
