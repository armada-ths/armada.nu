import geometry from "./geometry-2026.json"
import placements from "./placements-2026.json"
import type { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"

export interface Placement {
  exhibitorId: number
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

export function mapExhibitors(exhibitors: Exhibitor[]): MappedExhibitor[] {
  const byId = new Map(exhibitors.map(exhibitor => [exhibitor.id, exhibitor]))
  return PLACEMENTS.map(placement => {
    const exhibitor = byId.get(placement.exhibitorId)
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
