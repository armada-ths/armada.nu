export type Direction = 1 | -1

/** Next id in the looping order, skipping ids in `skip`. Null if nothing else can be shown. */
export function neighborId(
  order: readonly number[],
  id: number,
  direction: Direction,
  skip: ReadonlySet<number> = new Set()
): number | null {
  const count = order.length
  const start = Math.max(order.indexOf(id), 0)
  for (let step = 1; step <= count; step++) {
    const candidate =
      order[(((start + direction * step) % count) + count) % count]
    if (candidate === undefined) return null
    if (candidate !== id && !skip.has(candidate)) return candidate
  }
  return null
}

/**
 * Reconciles the playing order with a freshly fetched gallery (newest first).
 * Photos newer than everything already known play right after the current one;
 * older photos (later pages) join the end of the loop.
 */
export function mergeOrder(
  order: readonly number[],
  photoIds: readonly number[],
  currentId: number | null
): number[] {
  const present = new Set(photoIds)
  const kept = order.filter(id => present.has(id))
  if (kept.length === 0) return [...photoIds]

  const known = new Set(kept)
  const firstKnown = photoIds.findIndex(id => known.has(id))
  const newer: number[] = []
  const older: number[] = []
  photoIds.forEach((id, index) => {
    if (known.has(id)) return
    ;(index < firstKnown ? newer : older).push(id)
  })

  const at = currentId === null ? -1 : kept.indexOf(currentId)
  return [...kept.slice(0, at + 1), ...newer, ...kept.slice(at + 1), ...older]
}
