"use client"

import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle
} from "@/components/ui/drawer"
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
        <DialogContent
          className={cn(
            "max-h-[80%] w-[80%] border border-stone-500",
            className
          )}>
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="h-full min-h-0 overflow-hidden">{children}</div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={cn(
          "max-h-[85%] pt-0 focus-visible:outline-hidden",
          className,
          "w-full max-w-none"
        )}>
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <DrawerDescription className="sr-only">{description}</DrawerDescription>
        <div className="pb-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
