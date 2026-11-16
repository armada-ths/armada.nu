"use client"

import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import Modal from "@/components/ui/Modal"
import { cn } from "@/lib/utils"
import { track } from "@vercel/analytics"
import { useEffect, useRef, type ReactNode } from "react"
import ExhibitorDetails from "./ExhibitorDetails"
import { exhibitorTierColors } from "./exhibitorTierColors"

export default function ExhibitorModal({
  open,
  location,
  onClose,
  exhibitor,
  mapPlacementId,
  title,
  description,
  children
}: {
  open: boolean
  location: "student_map" | "student_exhibitors"
  onClose: () => void
  exhibitor?: Exhibitor
  mapPlacementId?: string
  title?: string
  description?: string
  children?: ReactNode
}) {
  const { width } = useScreenSize()
  const { background } = exhibitorTierColors(exhibitor?.tier)
  const isOpen = open && width !== undefined
  const exhibitorId = exhibitor?.id
  const exhibitorName = exhibitor?.name
  const trackedExhibitorId = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!isOpen || exhibitorId === undefined || exhibitorName === undefined) {
      trackedExhibitorId.current = undefined
      return
    }

    if (trackedExhibitorId.current === exhibitorId) return

    trackedExhibitorId.current = exhibitorId
    track("exhibitor_details_open", {
      location,
      exhibitor_name: exhibitorName
    })
  }, [isOpen, location, exhibitorId, exhibitorName])

  return (
    <Modal
      open={isOpen}
      setOpen={nextOpen => {
        if (!nextOpen) onClose()
      }}
      className={cn("border-licorice min-w-[80vw] p-0", background)}
      title={title}
      description={description}>
      <div
        className={cn("border-licorice border-solid p-4 sm:p-10", background)}>
        {exhibitor ? (
          <ExhibitorDetails
            key={exhibitor.id}
            exhibitor={exhibitor}
            mapPlacementId={mapPlacementId}
          />
        ) : (
          children
        )}
      </div>
    </Modal>
  )
}
