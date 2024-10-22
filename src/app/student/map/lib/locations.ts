export type LocationId = "nymble/2" | "nymble/3" | "library" //Removed nymble/1, we only show plan 2, 3 and library

export type Location = {
  id: LocationId
  label: string
  center: { longitude: number; latitude: number; zoom: number }
}

const nymbleCenter = {
  longitude: 18.070408551823675,
  latitude: 59.34726434961294,
  zoom: 19
}

const libraryCenter = {
  longitude: 18.072008997107673,
  latitude: 59.347931139608846,
  zoom: 19
}

export const locations: Location[] = [
  {
    id: "nymble/2",
    label: "Nymble - floor 2",
    center: nymbleCenter
  },
  {
    id: "nymble/3",
    label: "Nymble - floor 3",
    center: nymbleCenter
  },
  {
    id: "library",
    label: "Library",
    center: libraryCenter
  }
]

export const defaultLocation = locations[0]

export function validLocationId(locationId: string): locationId is LocationId {
  return locations.some(loc => loc.id === locationId)
}
