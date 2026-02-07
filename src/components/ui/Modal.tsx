"use client"

import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export default function Modal({
  children,
  open,
  setOpen,
  onClose,
  className,
  title = "Dialog",
  description = "Dialog content"
}: {
  children: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  onClose?: () => void
  className?: string
  title?: string
  description?: string
}) {
  const { width } = useScreenSize()

  function onOpenChange(open: boolean) {
    setOpen(open)
    if (!open && onClose) {
      onClose()
    }
  }

  if (width && width > 768) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogContent
          className={cn("max-h-[80%] w-[80%] overflow-y-auto", className)}>
          {children}
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={cn(
          "max-h-[90%] min-h-[50%] pt-0 focus-visible:outline-hidden",
          className
        )}>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
