import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-base border-2 border-stone-200 bg-secondary-background selection:bg-main selection:text-main-foreground px-3 py-2 text-sm font-base text-stone-950 placeholder:text-stone-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:text-stone-50 dark:placeholder:text-stone-50/50",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
