import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "rounded-base bg-secondary-background selection:bg-main selection:text-main-foreground font-base flex min-h-[80px] w-full border-2 border-stone-200 px-3 py-2 text-sm text-stone-950 placeholder:text-stone-950/50 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:text-stone-50 dark:placeholder:text-stone-50/50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
