"use client"

import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import Modal from "@/components/ui/Modal"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import ExhibitorDetails from "./ExhibitorDetails"
import { exhibitorTierColors } from "./exhibitorTierColors"

export default function ExhibitorModal({
  open,
  onClose,
  exhibitor,
  title,
  description,
  children
}: {
  open: boolean
  onClose: () => void
  exhibitor?: Exhibitor
  title?: string
  description?: string
  children?: ReactNode
}) {
  const { width } = useScreenSize()
  const { background } = exhibitorTierColors(exhibitor?.tier)
  return (
    <Modal
      open={open && width !== undefined}
      setOpen={nextOpen => {
        if (!nextOpen) onClose()
      }}
      className={cn("border-licorice min-w-[80vw] p-0", background)}
      title={title}
      description={description}>
      <div
        className={cn("border-licorice border-solid p-4 sm:p-10", background)}>
        {exhibitor ? (
          <ExhibitorDetails key={exhibitor.id} exhibitor={exhibitor} />
        ) : (
          children
        )}
      </div>
    </Modal>
  )
}
