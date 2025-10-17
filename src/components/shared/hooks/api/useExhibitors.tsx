import { Exhibitor, fetchExhibitors } from "@/components/shared/hooks/api/fetchExhibitors";
import { useEffect, useState } from "react";

const CACHE_KEY = "exhibitors_cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// in-memory cache
let inMemoryCache: { data: Exhibitor[]; timestamp: number } | null = null;

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
