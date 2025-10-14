import { useEffect, useState } from "react";

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

const CACHE_KEY = "exhibitors_cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// in-memory cache
let inMemoryCache: { data: Exhibitor[]; timestamp: number } | null = null;

async function fetchExhibitors(): Promise<Exhibitor[]> {
  const url = new URL("api/v1/exhibitors", process.env.NEXT_PUBLIC_API_URL);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch exhibitors: ${res.status}`);

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid response format: expected an array");
  }

  return data as Exhibitor[];
}


function getCachedData(): Exhibitor[] | null {
  const now = Date.now();

  // Check in-memory cache
  if (inMemoryCache && now - inMemoryCache.timestamp < CACHE_TTL) {
    return inMemoryCache.data;
  }

  // Check localStorage
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as {
      data: Exhibitor[];
      timestamp: number;
    };

    if (now - parsed.timestamp < CACHE_TTL) {
      inMemoryCache = parsed;
      return parsed.data;
    }
  } catch {
    // ignore parse errors
  }

  return null;
}


function setCachedData(data: Exhibitor[]) {
  const cacheEntry = { data, timestamp: Date.now() };
  inMemoryCache = cacheEntry;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
}

export function useExhibitors() {
  const [exhibitors, setExhibitors] = useState<Exhibitor[] | null>(() => getCachedData());
  const [loading, setLoading] = useState(!exhibitors);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!exhibitors) {
      setLoading(true);
      fetchExhibitors()
        .then((data) => {
          setCachedData(data);
          setExhibitors(data);
        })
        .catch((err: unknown) => {
          // handle unknown errors
          if (err instanceof Error) setError(err.message);
          else setError(String(err));
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return {
    exhibitors,
    loading,
    error,
    refetch: async () => {
      try {
        setLoading(true);
        const data = await fetchExhibitors();
        setCachedData(data);
        setExhibitors(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    },
  };

}