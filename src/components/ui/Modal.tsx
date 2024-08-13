"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export default function Modal({
  children,
  open,
  setOpen,
  onClose,
  className
}: {
  children: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  onClose?: () => void
  className?: string
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
          {children}
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={cn(
          "max-h-[75%] min-h-[50%] border border-stone-500 pt-0 focus-visible:outline-none",
          className
        )}>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
