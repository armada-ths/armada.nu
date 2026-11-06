"use client"

import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import Modal from "@/components/ui/Modal"
import { cn } from "@/lib/utils"
import { usePathname, useSearchParams } from "next/navigation"
import { memo, useState, type MouseEvent } from "react"
import { ExhibitorCard } from "./ExhibitorCard"
import ExhibitorDetails from "./ExhibitorDetails"

const ExhibitorGrid = memo(function ExhibitorGrid({
  exhibitors
}: {
  exhibitors: Exhibitor[]
}) {
  return (
    <div
      data-exhibitor-list
      className="mx-auto grid max-w-300 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {exhibitors.map(exhibitor => (
        <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
      ))}
    </div>
  )
})

export default function ExhibitorList({
  exhibitors,
  visibleExhibitors
}: {
  exhibitors: Exhibitor[]
  visibleExhibitors: Exhibitor[]
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { width } = useScreenSize()
  const selected = exhibitors.find(
    exhibitor => String(exhibitor.id) === searchParams.get("id")
  )
  const [lastSelected, setLastSelected] = useState(selected)
  // Keep the last company visible during the modal's closing animation.
  if (selected && selected !== lastSelected) setLastSelected(selected)
  const displayed = selected ?? lastSelected
  const tierClassName = cn({
    "bg-pineapple": displayed?.tier === "Gold",
    "bg-silver": displayed?.tier === "Silver",
    "bg-bronze": displayed?.tier === "Bronze"
  })

  function openCompany(event: MouseEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      "a[data-exhibitor-id]"
    )
    if (!link) return
    const id = link.dataset.exhibitorId
    if (!id) return
    event.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    params.set("id", id)
    window.history.pushState(
      null,
      "",
      `${pathname}?${params.toString()}${window.location.hash}`
    )
  }

  function closeCompany() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("id")
    const query = params.toString()
    window.history.replaceState(
      null,
      "",
      `${pathname}${query ? `?${query}` : ""}${window.location.hash}`
    )
  }

  return (
    <>
      <div onClickCapture={openCompany}>
        <ExhibitorGrid exhibitors={visibleExhibitors} />
      </div>
      <Modal
        open={Boolean(selected) && width !== undefined}
        setOpen={open => {
          if (!open) closeCompany()
        }}
        className={cn("border-licorice min-w-[80vw] p-0", tierClassName)}>
        {displayed && (
          <div
            className={cn(
              "border-licorice border-solid p-4 sm:p-10",
              tierClassName
            )}>
            <ExhibitorDetails key={displayed.id} exhibitor={displayed} />
          </div>
        )}
      </Modal>
    </>
  )
}
