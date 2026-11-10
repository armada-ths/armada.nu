"use client"

import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { usePathname, useSearchParams } from "next/navigation"
import { memo, useState, type MouseEvent } from "react"
import { ExhibitorCard } from "./ExhibitorCard"
import { getExhibitorPlacement } from "@/components/map/maps"
import ExhibitorModal from "./ExhibitorModal"

const ExhibitorGrid = memo(function ExhibitorGrid({
  exhibitors
}: {
  exhibitors: Exhibitor[]
}) {
  return (
    <div
      data-exhibitor-list
      className="mx-auto grid max-w-300 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {exhibitors.map(exhibitor => (
        <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
      ))}
    </div>
  )
})

export default function ExhibitorList({
  exhibitors,
  visibleExhibitors,
  mapEnabled = false
}: {
  exhibitors: Exhibitor[]
  visibleExhibitors: Exhibitor[]
  mapEnabled?: boolean
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const selected = exhibitors.find(
    exhibitor => String(exhibitor.id) === searchParams.get("id")
  )
  const [lastSelected, setLastSelected] = useState(selected)
  // Keep the last company visible during the modal's closing animation.
  if (selected && selected !== lastSelected) setLastSelected(selected)
  const displayed = selected ?? lastSelected

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
      <ExhibitorModal
        open={Boolean(selected)}
        onClose={closeCompany}
        exhibitor={displayed}
        mapPlacementId={
          mapEnabled && displayed
            ? getExhibitorPlacement(displayed)?.id
            : undefined
        }
      />
    </>
  )
}
