import geometry from "./geometry-2026.json"
import placements from "./placements-2026.json"
import { normalizeExternalUrl } from "@/lib/externalUrl"
import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"

export interface Placement {
  // Eventro ID, or a local key for an exhibitor matched by name and website.
  id: string
  companyWebsite?: string
  name: string
  floor: number
  booth: number
  room: string
  day?: number
}

export type MapDefinition = (typeof geometry)[number]
export const MAPS = geometry
export const PLACEMENTS: Placement[] = placements

export interface MappedExhibitor extends Placement {
  exhibitor?: Exhibitor
}

const placementsByEventroId = new Map(
  PLACEMENTS.filter(p => !p.companyWebsite).map(p => [p.id, p])
)
const manualPlacements = PLACEMENTS.filter(p => p.companyWebsite)

export function getExhibitorPlacement(exhibitor: Exhibitor) {
  if (exhibitor.eventroId) return placementsByEventroId.get(exhibitor.eventroId)

  const website = normalizeExternalUrl(exhibitor.companyWebsite)
  if (!website) return undefined
  return manualPlacements.find(
    p =>
      p.name === exhibitor.name &&
      normalizeExternalUrl(p.companyWebsite) === website
  )
}

export function mapExhibitors(exhibitors: Exhibitor[]): MappedExhibitor[] {
  const byPlacementId = new Map<string, Exhibitor>()
  for (const exhibitor of exhibitors) {
    const placement = getExhibitorPlacement(exhibitor)
    if (placement) byPlacementId.set(placement.id, exhibitor)
  }

  return PLACEMENTS.map(placement => {
    const exhibitor = byPlacementId.get(placement.id)
    return {
      ...placement,
      name: exhibitor?.name || placement.name,
      exhibitor
    }
  })
}

export function boothId(floor: number, booth: number) {
  return `nymble-${floor}-booth-${booth}`
}
