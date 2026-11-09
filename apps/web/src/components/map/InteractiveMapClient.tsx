"use client"

import { Page } from "@/components/shared/Page"
import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import CompanySearch from "./CompanySearch"
import FairMap from "./FairMap"
import FloorSelector from "./FloorSelector"
import { MAPS, mapExhibitors, type MappedExhibitor } from "./maps"

export default function InteractiveMapClient({
  title,
  exhibitors,
  initialExhibitorId
}: {
  title: string
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
      <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 sm:grid-cols-[auto_1fr_auto]">
        <Page.Header className="text-4xl sm:text-5xl">{title}</Page.Header>
        <div className="order-last col-span-2 sm:order-0 sm:col-span-1 sm:justify-self-center">
          <FloorSelector
            floors={MAPS.map(map => t("floor", { floor: map.floor }))}
            selectedFloor={t("floor", { floor: floor.floor })}
            onSelect={name => {
              const map = MAPS.find(
                m => t("floor", { floor: m.floor }) === name
              )
              if (!map) return
              setFloor(map)
              setFocus(null)
            }}
          />
        </div>
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

      <p className="sr-only" role="status">
        {focus &&
          t("searchResult", {
            name: focus.name,
            floor: focus.floor,
            booth: focus.booth,
            room: focus.room
          })}
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
