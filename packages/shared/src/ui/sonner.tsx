"use client"

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert
} from "lucide-react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-snow group-[.toaster]:text-stone-950 group-[.toaster]:border-stone-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-stone-500",
          actionButton:
            "group-[.toast]:bg-stone-900 group-[.toast]:text-stone-50",
          cancelButton:
            "group-[.toast]:bg-stone-100 group-[.toast]:text-stone-500"
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
