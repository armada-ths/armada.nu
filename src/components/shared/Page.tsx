import { cn } from "@/lib/utils"

export function Page() {
  return null
}

Page.Boundary = function PageBoundary({
  children,
  className,
  maxWidth,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { maxWidth?: number }) {
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
    <div
      className={cn(
        "via-emerald-white relative flex min-h-dvh flex-1 flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900",
        {
          "px-5 py-10": withIndents
        },
        className
      )}
      {...rest}>
      <div className="absolute top-0 h-full w-full overflow-hidden">
        <div className="absolute right-0 top-[80%] h-60 w-60 rounded-full bg-emerald-700 opacity-20 blur-3xl filter"></div>
        <div className="absolute right-1/4 top-[30%] h-52 w-52 rounded-full bg-emerald-700 opacity-20 blur-3xl filter"></div>
        <div className="absolute right-1/3 top-[150%] h-96 w-96 rounded-full bg-emerald-700 opacity-10 blur-3xl filter"></div>
        <div className="absolute left-10 top-[250%] h-96 w-96 rounded-full bg-emerald-700 opacity-10 blur-3xl filter"></div>
        <div className="absolute left-2/3 top-[300%] h-96 w-96 rounded-full bg-emerald-700 opacity-10 blur-3xl filter"></div>
        <div className="absolute right-1/2 top-[350%] h-96 w-96 rounded-full bg-emerald-700 opacity-5 blur-3xl filter"></div>
        <div className="absolute right-2/3 top-[400%] h-96 w-96 rounded-full bg-emerald-700 opacity-10 blur-3xl filter"></div>
        <div className="absolute left-2/3 top-[450%] h-96 w-96 rounded-full bg-emerald-700 opacity-10 blur-3xl filter"></div>
      </div>
      {!props.avoidHeader && <div className="h-16" />}
      <div className="z-10 flex w-full flex-1 flex-col">{children}</div>
    </div>
  )
}
