"use client"

import ExhibitorModal from "@/app/[locale]/student/exhibitors/_components/ExhibitorModal"
import { exhibitorTierColors } from "@/app/[locale]/student/exhibitors/_components/exhibitorTierColors"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@armada/shared/i18n/navigation"
import { Minus, Plus, RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef
} from "react-zoom-pan-pinch"
import { boothId, type MapDefinition, type MappedExhibitor } from "./maps"

function BoothLogo({
  entry,
  cx,
  cy,
  height
}: {
  entry: MappedExhibitor
  cx: number
  cy: number
  height: number
}) {
  const [failedSources, setFailedSources] = useState<string[]>([])
  const logo = [
    entry.exhibitor?.logoThumbnail,
    entry.exhibitor?.logoFreesize,
    entry.exhibitor?.logoSquared
  ].find(source => source && !failedSources.includes(source))

  if (logo) {
    return (
      <image
        key={logo}
        href={logo}
        x={cx - 31}
        y={cy - height / 2}
        width={62}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        pointerEvents="none"
        onError={() => setFailedSources(sources => [...sources, logo])}
      />
    )
  }

  const words = entry.name.trim().split(/\s+/)
  const initials =
    words.length === 1
      ? words[0].slice(0, 3)
      : words
          .slice(0, 3)
          .map(word => word[0])
          .join("")
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={Math.min(19, height)}
      className="fill-licorice font-bold"
      aria-hidden="true"
      pointerEvents="none">
      {initials.toUpperCase()}
    </text>
  )
}

export default function FairMap({
  floor,
  placements,
  focus,
  suppressHover = false
}: {
  floor: MapDefinition
  placements: MappedExhibitor[]
  focus: MappedExhibitor | null
  suppressHover?: boolean
}) {
  const t = useTranslations("FairMap")
  const [activeBooth, setActiveBooth] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const transform = useRef<ReactZoomPanPinchRef | null>(null)
  const panned = useRef(false)
  const markers = new Map<number, MappedExhibitor[]>()
  for (const placement of placements) {
    const existing = markers.get(placement.booth) ?? []
    markers.set(placement.booth, [...existing, placement])
  }
  const activeExhibitors =
    activeBooth === null ? [] : (markers.get(activeBooth) ?? [])
  const single = activeExhibitors.length === 1 ? activeExhibitors[0] : undefined
  const [x, y, width, height] = floor.box

  function openBooth(booth: number) {
    setActiveBooth(booth)
    setDialogOpen(true)
  }

  useEffect(() => {
    if (!focus || !ready) return
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    transform.current?.zoomToElement(
      boothId(floor.floor, focus.booth),
      window.innerWidth < 768 ? 4 : 2.5,
      reduceMotion ? 0 : 250
    )
  }, [floor.floor, focus, ready])

  return (
    <>
      <TransformWrapper
        ref={transform}
        onInit={() => setReady(true)}
        onPanningStart={() => {
          panned.current = false
        }}
        onPanning={() => {
          panned.current = true
        }}
        minScale={1}
        maxScale={5}
        doubleClick={{ disabled: true }}
        centerOnInit>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="bg-fair-map-background relative min-h-48 w-full flex-1 overflow-hidden rounded-xl">
              <TransformComponent
                wrapperClass="size-full! touch-none"
                contentClass="size-full!">
                <svg
                  aria-label={t("floor", { floor: floor.floor })}
                  className="block size-full select-none"
                  viewBox={floor.box.join(" ")}>
                  <image
                    href={`/fair-map/nymble-${floor.floor}.svg`}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    aria-hidden="true"
                    pointerEvents="none"
                  />
                  {floor.markers.map(([booth, cx, cy]) => {
                    const entries = markers.get(booth)
                    if (!entries) return null

                    const selected = focus?.booth === booth
                    const id = boothId(floor.floor, booth)
                    const cardHeight = 58
                    const rowHeight = cardHeight / entries.length
                    return (
                      <g
                        key={booth}
                        id={id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${t("booth", { booth })}, ${entries.map(entry => entry.name).join(", ")}`}
                        className="group cursor-pointer outline-none"
                        onPointerDown={() => {
                          panned.current = false
                        }}
                        onClick={() => {
                          if (!panned.current) openBooth(booth)
                        }}
                        onKeyDown={event => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            openBooth(booth)
                          }
                        }}>
                        <title>
                          {entries.map(entry => entry.name).join(" · ")}
                        </title>
                        {entries.length > 1 && (
                          <clipPath id={`${id}-clip`}>
                            <rect
                              x={cx - 35}
                              y={cy - cardHeight / 2}
                              width={70}
                              height={cardHeight}
                              rx={8}
                            />
                          </clipPath>
                        )}
                        <g
                          clipPath={
                            entries.length > 1 ? `url(#${id}-clip)` : undefined
                          }>
                          {entries.map((entry, index) => {
                            const top = cy - cardHeight / 2 + rowHeight * index
                            return (
                              <g key={entry.exhibitorId}>
                                <rect
                                  x={cx - 35}
                                  y={top}
                                  width={70}
                                  height={rowHeight}
                                  rx={entries.length === 1 ? 8 : undefined}
                                  className={
                                    exhibitorTierColors(entry.exhibitor?.tier)
                                      .fill
                                  }
                                />
                                <BoothLogo
                                  entry={entry}
                                  cx={cx}
                                  cy={top + rowHeight / 2}
                                  height={rowHeight - 8}
                                />
                              </g>
                            )
                          })}
                        </g>
                        <rect
                          x={cx - 35}
                          y={cy - cardHeight / 2}
                          width={70}
                          height={cardHeight}
                          rx={8}
                          pointerEvents="none"
                          className={cn(
                            "group-focus-visible:stroke-licorice fill-none",
                            !suppressHover && "group-hover:stroke-licorice",
                            selected
                              ? "stroke-licorice stroke-4"
                              : "stroke-licorice/25 stroke-2"
                          )}
                        />
                      </g>
                    )
                  })}
                </svg>
              </TransformComponent>
            </div>
            <div className="flex shrink-0 justify-end gap-2">
              <Button
                type="button"
                size="icon"
                variant="neutral"
                aria-label={t("zoomIn")}
                onClick={() => zoomIn()}>
                <Plus aria-hidden="true" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="neutral"
                aria-label={t("zoomOut")}
                onClick={() => zoomOut()}>
                <Minus aria-hidden="true" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="neutral"
                aria-label={t("resetZoom")}
                onClick={() => resetTransform()}>
                <RotateCcw aria-hidden="true" />
              </Button>
            </div>
          </>
        )}
      </TransformWrapper>

      <ExhibitorModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        exhibitor={single?.exhibitor}
        title={
          activeBooth !== null ? t("booth", { booth: activeBooth }) : undefined
        }
        description={activeExhibitors[0]?.room}>
        <div className="space-y-4">
          {activeBooth !== null && (
            <h2 className="font-bebas-neue text-3xl">
              {t("booth", { booth: activeBooth })} · {activeExhibitors[0]?.room}
            </h2>
          )}
          <ul className="space-y-4">
            {activeExhibitors.map(entry => (
              <li key={entry.exhibitorId} className="space-y-1">
                {entry.day && (
                  <p className="text-sm">{t("day", { day: entry.day })}</p>
                )}
                {entry.exhibitor ? (
                  <Link
                    href={`/student/exhibitors?id=${entry.exhibitorId}`}
                    className="font-semibold underline underline-offset-4">
                    {entry.name}
                  </Link>
                ) : (
                  <p className="font-semibold">{entry.name}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </ExhibitorModal>
    </>
  )
}
