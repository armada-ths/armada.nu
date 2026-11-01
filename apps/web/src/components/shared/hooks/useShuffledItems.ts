"use client"

import { useLayoutEffect, useRef, useState } from "react"

// Shuffle after hydration so each page opening gets its own order, independent of server caching.
export function useShuffledItems<T>(
  items: readonly T[],
  getKey?: (item: T) => string | number
) {
  const [shuffledItems, setShuffledItems] = useState<T[] | null>(null)
  const previous = useRef<T[] | null>(null)

  useLayoutEffect(() => {
    const latest = getKey
      ? new Map(items.map(item => [getKey(item), item]))
      : null
    if (
      getKey &&
      latest &&
      previous.current?.length === items.length &&
      previous.current.every(item => latest.has(getKey(item)))
    ) {
      // Query-string navigation can deliver fresh objects for the same companies.
      const refreshed = previous.current.map(item => latest.get(getKey(item))!)
      previous.current = refreshed
      setShuffledItems(refreshed)
      return
    }

    const shuffled = [...items]
    for (let index = shuffled.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1))
      ;[shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]]
    }
    previous.current = shuffled
    setShuffledItems(shuffled)
  }, [items, getKey])

  return shuffledItems
}
