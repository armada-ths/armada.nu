"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface FloorSelectorProps {
  floors: string[]
  selectedFloor: string
  onSelect: (floor: string) => void
}

export default function FloorSelector({
  floors,
  selectedFloor,
  onSelect
}: FloorSelectorProps) {
  const t = useTranslations("FairMap")

  return (
    <div role="group" aria-label={t("floors")} className="flex flex-wrap gap-2">
      {floors.map(floor => (
        <Button
          key={floor}
          type="button"
          aria-pressed={selectedFloor === floor}
          variant={selectedFloor === floor ? "default" : "neutral"}
          onClick={() => onSelect(floor)}>
          {floor}
        </Button>
      ))}
    </div>
  )
}
