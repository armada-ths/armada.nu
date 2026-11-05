import { describe, expect, it } from "vitest"

import { mergeOrder, neighborId } from "./slideshow"

describe("neighborId", () => {
  it("loops forwards and backwards", () => {
    expect(neighborId([1, 2, 3], 3, 1)).toBe(1)
    expect(neighborId([1, 2, 3], 1, -1)).toBe(3)
    expect(neighborId([1, 2, 3], 1, 1)).toBe(2)
  })

  it("skips failed photos", () => {
    expect(neighborId([1, 2, 3], 1, 1, new Set([2]))).toBe(3)
  })

  it("returns null when there is nothing else to show", () => {
    expect(neighborId([], 1, 1)).toBeNull()
    expect(neighborId([1], 1, 1)).toBeNull()
    expect(neighborId([1, 2], 1, 1, new Set([2]))).toBeNull()
  })

  it("starts from the first photo when the current one disappeared", () => {
    expect(neighborId([4, 5], 9, 1)).toBe(5)
  })
})

describe("mergeOrder", () => {
  it("uses gallery order when nothing is known yet", () => {
    expect(mergeOrder([], [3, 2, 1], null)).toEqual([3, 2, 1])
  })

  it("plays newly uploaded photos right after the current one", () => {
    expect(mergeOrder([3, 2, 1], [5, 4, 3, 2, 1], 2)).toEqual([3, 2, 5, 4, 1])
  })

  it("appends older pages to the end of the loop", () => {
    expect(mergeOrder([3, 2], [3, 2, 1, 0], 3)).toEqual([3, 2, 1, 0])
  })

  it("drops photos that were removed from the gallery", () => {
    expect(mergeOrder([3, 2, 1], [3, 1], 3)).toEqual([3, 1])
  })

  it("handles new and older photos arriving together", () => {
    expect(mergeOrder([3, 2], [4, 3, 2, 1], 3)).toEqual([3, 4, 2, 1])
  })
})
