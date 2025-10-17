//
// NOTE TO DEVS IN THE FUTURE: ALWAYS GO FOR SSR FOR FETCHES
//
// THIS WHOLE THING IS PATCH WORK AND WAS ORIGINALLY IN A CLIENT SIDE COMPONENT
// FOR YOUR SANITY: CLEAN THIS UP AND MAKE THE FETCHES IN THEIR SEPARATE FOLDER UNDER SRC/LIB/API INSTEAD
// HOOKS CAN STILL BE IN THIS FOLDER
// I AM TOO LAZY TO FIX IT

export interface Exhibitor {
  id: number
  name: string
  type: string
  tier?: string
  companyWebsite?: string
  about?: string
  purpose?: string
  logoSquared?: string
  logoFreesize?: string
  mapImg?: string
  industries?: Industry[]
  values?: unknown[] // TODO Define this
  employments?: Employment[]
  locations?: Location[]
  competences?: unknown[] // TODO Define this
  cities?: string
  benefits?: unknown[] // TODO Define this
  average_age?: unknown // TODO Define this
  founded?: unknown // TODO Define this
  groups?: Group[]
  fairLocation: string
  vyerPosition?: string
  locationSpecial?: string
  climateCompensation: boolean
  flyer?: string
  booths?: unknown[] // TODO Define this
  map_coordinates?: number[][]
}

export interface Industry {
  id: number
  name: string
}

export interface Employment {
  id: number
  name: string
}

export interface Location {
  id: number
  name: string
}

export interface Group {
  id: number
  name: string
}

export interface ExhibitorFilters {
  tier?: string
  type?: string
  industryId?: number
  search?: string
}

export async function fetchExhibitors(filters?: ExhibitorFilters): Promise<Exhibitor[]> {
  const url = new URL("api/v1/exhibitors", process.env.NEXT_PUBLIC_API_URL);

  url.searchParams.set("all", "true");

  if (filters) {
    const jsonFilter = JSON.stringify(filters);
    url.searchParams.set("filter", jsonFilter);
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch exhibitors: ${res.status}`);

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Invalid response format: expected an array");

  return data as Exhibitor[];
}