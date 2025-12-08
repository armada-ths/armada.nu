import { cn } from "@/lib/utils"

export function P(props: React.HTMLAttributes<HTMLParagraphElement>) {
  const { className, children, ...rest } = props
  return (
    <p className={cn("mt-2 text-licorice", className)} {...rest}>
      {children}
    </p>
  )
}
