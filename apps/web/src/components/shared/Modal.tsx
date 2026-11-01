"use client"
import { LanguageSwitcher, useTranslations } from "@armada/shared/i18n/client"

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
  title,
  description
}: {
  children: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  onClose?: () => void
  className?: string
  title?: string
  description?: string
}) {
  const t = useTranslations("Common")
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
          <div className="absolute top-3 right-14 z-20 rounded-full bg-white/95">
            <LanguageSwitcher />
          </div>
          <DialogHeader className="sr-only">
            <DialogTitle>{title ?? t("dialog")}</DialogTitle>
            <DialogDescription>
              {description ?? t("dialogDescription")}
            </DialogDescription>
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
        <div className="absolute top-3 right-4 z-20 rounded-full bg-white/95">
          <LanguageSwitcher />
        </div>
        <DrawerTitle className="sr-only">{title ?? t("dialog")}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {description ?? t("dialogDescription")}
        </DrawerDescription>
        <div className="pb-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
