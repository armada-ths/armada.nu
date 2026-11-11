import { Page as SharedPage } from "@armada/shared/Page"
import { cn } from "@armada/shared/cn"
import type { ComponentProps } from "react"

export const Page = {
  Boundary: function PageBoundary({
    className,
    ...props
  }: Omit<ComponentProps<typeof SharedPage.Boundary>, "maxWidth">) {
    return <SharedPage.Boundary {...props} className={cn("px-6", className)} />
  },

  Background: function PageBackground({
    className,
    withIndents,
    ...props
  }: ComponentProps<typeof SharedPage.Background>) {
    return (
      <SharedPage.Background
        {...props}
        withIndents={withIndents}
        className={cn(withIndents && "px-0", className)}
      />
    )
  },

  Header: SharedPage.Header
}
