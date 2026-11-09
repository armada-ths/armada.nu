"use client"

import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import CompanySearch from "./CompanySearch"
import FairMap from "./FairMap"
import FloorSelector from "./FloorSelector"
import { MAPS, mapExhibitors, type MappedExhibitor } from "./maps"

export default function InteractiveMapClient({
  exhibitors,
  initialExhibitorId
}: {
  exhibitors: Exhibitor[]
  initialExhibitorId?: string
}) {
  const t = useTranslations("FairMap")
  const placements = useMemo(() => mapExhibitors(exhibitors), [exhibitors])
  const [focus, setFocus] = useState<MappedExhibitor | null>(
    () =>
      placements.find(
        placement => String(placement.exhibitorId) === initialExhibitorId
      ) ?? null
  )
  const [floor, setFloor] = useState(
    () => MAPS.find(map => map.floor === focus?.floor) ?? MAPS[0]
  )
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <section
      aria-label={t("title")}
      className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <FloorSelector
          floors={MAPS.map(map => t("floor", { floor: map.floor }))}
          selectedFloor={t("floor", { floor: floor.floor })}
          onSelect={name => {
            const map = MAPS.find(m => t("floor", { floor: m.floor }) === name)
            if (!map) return
            setFloor(map)
            setFocus(null)
          }}
        />
        <CompanySearch
          exhibitors={placements}
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onSelect={placement => {
            const map = MAPS.find(m => m.floor === placement.floor)
            if (!map) return
            setFloor(map)
            setFocus({ ...placement })
          }}
        />
      </div>

      <p className="shrink-0 text-sm" role="status">
        {focus
          ? t("searchResult", {
              name: focus.name,
              floor: focus.floor,
              booth: focus.booth,
              room: focus.room
            })
          : t("instructions")}
      </p>
      <FairMap
        key={floor.floor}
        floor={floor}
        placements={placements.filter(p => p.floor === floor.floor)}
        focus={focus}
        suppressHover={searchOpen}
      />
    </section>
  )
}
