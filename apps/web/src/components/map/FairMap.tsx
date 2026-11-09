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

const BOOTH_HEIGHT = 58

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

  const name = entry.name.trim()
  const brand = name.replace(
    /(?:[\s,]+(?:ab|hb|kb|ag|as|asa|a\/s|aps|oyj?|ltd|limited|llc|llp|plc|inc|corp|corporation|gmbh(?:\s+&\s+co\.?\s+kg)?|kgaa|kg|b\.?v|n\.?v|s\.?a|s\.?a\.?s|s\.?a\.?r\.?l|s\.?r\.?l|s\.?p\.?a|s\.?l)\.?)+(?:\s*\(publ\))?$/i,
    ""
  )
  const words = (brand || name).split(/\s+/)
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

function BoothLabel({
  name,
  cx,
  cy,
  box: [x, y, width]
}: {
  name: string
  cx: number
  cy: number
  box: MapDefinition["box"]
}) {
  const labelWidth = Math.min(500, 2 * Math.min(cx - x, x + width - cx))
  const labelHeight = 136
  const below = cy - y < 180
  const tipY = cy + (below ? BOOTH_HEIGHT / 2 : -BOOTH_HEIGHT / 2)
  const arrowHeight = below ? 12 : -12
  const labelY = tipY + arrowHeight - (below ? 0 : labelHeight)

  return (
    <g aria-hidden="true" pointerEvents="none">
      <foreignObject
        x={cx - labelWidth / 2}
        y={labelY}
        width={labelWidth}
        height={labelHeight}
        className="overflow-visible">
        <div
          className={cn(
            "flex h-full justify-center",
            below ? "items-start" : "items-end"
          )}>
          <span
            data-map-label
            className="bg-licorice text-snow pointer-events-auto max-w-full rounded-lg px-4 py-2 text-center text-[30px] leading-tight font-bold wrap-anywhere shadow-md">
            {name}
          </span>
        </div>
      </foreignObject>
      <path
        d={`M ${cx} ${tipY} l -12 ${arrowHeight} h 24 Z`}
        className="fill-licorice pointer-events-auto"
      />
    </g>
  )
}

export default function FairMap({
  floor,
  placements,
  focus,
  onBoothOpen,
  suppressHover = false
}: {
  floor: MapDefinition
  placements: MappedExhibitor[]
  focus: MappedExhibitor | null
  onBoothOpen?: (booth: number) => void
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
  const focusedMarker = floor.markers.find(([booth]) => booth === focus?.booth)

  function openBooth(booth: number) {
    onBoothOpen?.(booth)
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
      reduceMotion ? 0 : 400
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
        wheel={{ step: 0.0025 }}
        pinch={{ step: 3 }}
        doubleClick={{ disabled: true }}>
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
                    const rowHeight = BOOTH_HEIGHT / entries.length
                    return (
                      <g
                        key={booth}
                        id={id}
                        data-selected={selected || undefined}
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
                              y={cy - BOOTH_HEIGHT / 2}
                              width={70}
                              height={BOOTH_HEIGHT}
                              rx={8}
                            />
                          </clipPath>
                        )}
                        <g
                          clipPath={
                            entries.length > 1 ? `url(#${id}-clip)` : undefined
                          }>
                          {entries.map((entry, index) => {
                            const top =
                              cy - BOOTH_HEIGHT / 2 + rowHeight * index
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
                          y={cy - BOOTH_HEIGHT / 2}
                          width={70}
                          height={BOOTH_HEIGHT}
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
                  {focus && focusedMarker && (
                    <BoothLabel
                      name={focus.name}
                      cx={focusedMarker[1]}
                      cy={focusedMarker[2]}
                      box={floor.box}
                    />
                  )}
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
