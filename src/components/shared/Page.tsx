import { AuroraBackground } from "@/components/ui/aurora-background"
import { cn } from "@/lib/utils"

export function Page() {
  return null
}

Page.Boundary = function PageBoundary({
  children,
  className,
  maxWidth,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { maxWidth?: string | number }) {
  return (
    <div
      className={cn("mx-auto mt-10 flex w-full flex-1 flex-col", className)}
      style={{ maxWidth: maxWidth ?? 1000 }}
      {...rest}>
      {children}
    </div>
  )
}
Page.Header = function PageHeader(
  props: React.HTMLAttributes<HTMLDivElement> & {
    tier?: "primary" | "secondary"
  }
) {
  const { children, className, ...rest } = props
  if (props.tier === "secondary") {
    return (
      <h2
        className={cn("font-bebas-neue text-3xl text-stone-400", className)}
        {...rest}>
        {children}
      </h2>
    )
  }

  return (
    <h1
      className={cn("font-bebas-neue text-5xl text-melon-700", className)}
      {...rest}>
      {children}
    </h1>
  )
}
Page.Background = function PageBackground(
  props: React.HTMLAttributes<HTMLDivElement> & {
    avoidHeader?: boolean
    withIndents?: boolean
  }
) {
  const { children, className, withIndents, ...rest } = props
  return (
    <AuroraBackground
      className={cn(
        {
          "px-5 py-10": withIndents
        },
        className
      )}
      {...rest}>
      {!props.avoidHeader && <div className="h-16" />}
      <div className="z-10 flex w-full flex-1 flex-col">{children}</div>
    </AuroraBackground>
  )
}
