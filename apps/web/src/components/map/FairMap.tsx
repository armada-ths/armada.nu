"use client"

import ExhibitorDetails from "@/app/[locale]/student/exhibitors/_components/ExhibitorDetails"
import { Button } from "@/components/ui/button"
import Modal from "@/components/ui/Modal"
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

export default function FairMap({
  floor,
  placements,
  focus
}: {
  floor: MapDefinition
  placements: MappedExhibitor[]
  focus: MappedExhibitor | null
}) {
  const t = useTranslations("FairMap")
  const [activeBooth, setActiveBooth] = useState<number | null>(null)
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
        wheel={{ disabled: true }}
        doubleClick={{ disabled: true }}
        centerOnInit>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="bg-fair-map-background relative aspect-4/3 min-h-72 overflow-hidden rounded-xl md:aspect-16/10">
              <TransformComponent
                wrapperClass="size-full!"
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
                    const isGold = entries.some(
                      entry => entry.exhibitor?.tier?.toLowerCase() === "gold"
                    )
                    return (
                      <g
                        key={booth}
                        id={boothId(floor.floor, booth)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${t("booth", { booth })}, ${entries.map(entry => entry.name).join(", ")}`}
                        className="group cursor-pointer outline-none"
                        onPointerDown={() => {
                          panned.current = false
                        }}
                        onClick={() => {
                          if (!panned.current) setActiveBooth(booth)
                        }}
                        onKeyDown={event => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            setActiveBooth(booth)
                          }
                        }}>
                        <rect
                          x={cx - 33}
                          y={cy - 32}
                          width={66}
                          height={64}
                          rx={12}
                          className={
                            selected
                              ? "fill-pineapple/30 stroke-licorice stroke-3"
                              : `group-hover:stroke-licorice group-focus-visible:stroke-licorice fill-transparent stroke-3 ${isGold ? "stroke-pineapple" : "stroke-transparent"}`
                          }
                        />
                      </g>
                    )
                  })}
                </svg>
              </TransformComponent>
            </div>
            <div className="mt-2 flex justify-end gap-2">
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

      <Modal
        open={activeBooth !== null}
        setOpen={open => {
          if (!open) setActiveBooth(null)
        }}
        title={t("booth", { booth: activeBooth ?? 0 })}
        description={activeExhibitors[0]?.room}>
        <div className="space-y-4 p-4 sm:p-6">
          {activeBooth !== null && (
            <h2 className="font-bebas-neue text-3xl">
              {t("booth", { booth: activeBooth })} · {activeExhibitors[0]?.room}
            </h2>
          )}
          {single?.exhibitor ? (
            <ExhibitorDetails exhibitor={single.exhibitor} />
          ) : (
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
          )}
        </div>
      </Modal>
    </>
  )
}
