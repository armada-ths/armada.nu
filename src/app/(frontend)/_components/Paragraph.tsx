import { cn } from "@/lib/utils"

export function P(props: React.HTMLAttributes<HTMLParagraphElement>) {
  const { className, children, ...rest } = props
  return (
    <p className={cn("text-licorice mt-2", className)} {...rest}>
      {children}
    </p>
  )
}
