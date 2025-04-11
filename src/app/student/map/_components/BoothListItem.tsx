"use client"
import { LocationId, locations } from "@/app/student/map/lib/locations"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StarIcon } from "lucide-react"
import Image from "next/image"
import { Booth, BoothID } from "../lib/booths"

export function BoothListItem({
  booth,
  onBoothClick,
  onBoothNavigate,
  onMouseEnter,
  onMouseLeave,
  closeDrawer,
  isGold,
  currentLocationId
}: {
  booth: Booth
  onBoothClick: (boothId: BoothID) => void
  onBoothNavigate: (boothId: BoothID | null) => void
  currentLocationId: LocationId
  onMouseEnter: () => void
  onMouseLeave: () => void
  closeDrawer: () => void
  isGold: boolean
}) {
  const logoSrc = booth.exhibitor.logo_squared ?? booth.exhibitor.logo_freesize

  function onBoothMapNavigate() {
    /* Sorry to the person that has to read this code
      At this point we're on hour 20 of trying to hotfix
      the map, we're tired, we want to go home, and there
      is no coffe left, I'm starting to question my choices.
      But we're here to make the fair great, and great it will be!
    */
    onBoothNavigate(null)
    setTimeout(() => onBoothNavigate(booth.id))
  }

  return (
    <Card
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "cursor-pointer rounded-none first-of-type:rounded-tl-md first-of-type:rounded-tr-md last-of-type:rounded-bl-md last-of-type:rounded-br-md",
        {}
      )}
      onClick={() => onBoothClick(booth.id)}>
      <div className="transition hover:bg-white/10">
        <div className="ml-4 flex h-full items-center">
          {logoSrc ? (
            <Image
              className="mr-2 size-16 object-contain py-4"
              src={logoSrc}
              alt={booth.exhibitor.name}
              width={300}
              height={300}></Image>
          ) : (
            <div className="mr-2 size-16"></div>
          )}
          <div className="py-2">
            <p className="overflow-ellipsis">{booth.exhibitor.name}</p>
            <div className={cn("ml-auto mr-2 text-xs text-stone-400/50")}>
              {locations.find(loc => loc.id === booth.location)?.label}
            </div>
          </div>
          <div
            className="ml-auto"
            onClick={event => {
              event.stopPropagation()
              event.preventDefault()
              closeDrawer()
            }}></div>
          {isGold && (
            <div className="flex gap-2 px-4">
              <StarIcon className="stroke-yellow-500" />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
