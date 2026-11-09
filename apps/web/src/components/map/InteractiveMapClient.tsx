"use client"

import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import CompanySearch from "./CompanySearch"
import FairMap from "./FairMap"
import FloorSelector from "./FloorSelector"
import { MAPS, mapExhibitors, type MappedExhibitor } from "./maps"

export default function InteractiveMapClient({
  exhibitors
}: {
  exhibitors: Exhibitor[]
}) {
  const t = useTranslations("FairMap")
  const [floor, setFloor] = useState(MAPS[0])
  const [focus, setFocus] = useState<MappedExhibitor | null>(null)
  const placements = useMemo(() => mapExhibitors(exhibitors), [exhibitors])

  return (
    <section aria-label={t("title")} className="space-y-3 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
          onSelect={placement => {
            const map = MAPS.find(m => m.floor === placement.floor)
            if (!map) return
            setFloor(map)
            setFocus({ ...placement })
          }}
        />
      </div>

      <p className="text-sm" role="status">
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
      />
    </section>
  )
}
