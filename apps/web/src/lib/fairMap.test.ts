import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { MAPS, PLACEMENTS, boothId, mapExhibitors } from "@/components/map/maps"

describe("2026 fair map", () => {
  it("assigns every verified exhibitor to a unique placement on one of the two SVG floors", () => {
    expect(MAPS.map(({ floor, markers }) => [floor, markers.length])).toEqual([
      [2, 65],
      [3, 22]
    ])
    expect(PLACEMENTS).toHaveLength(88)
    expect(new Set(PLACEMENTS.map(p => p.exhibitorId)).size).toBe(88)

    const markers = MAPS.flatMap(({ floor, box, markers }) => {
      const svg = readFileSync(
        new URL(`../../public/fair-map/nymble-${floor}.svg`, import.meta.url),
        "utf8"
      )
      expect(svg).toContain(`viewBox="${box.join(" ")}"`)
      const printedNumbers = [...svg.matchAll(/data-booth-label="(\d+)"/g)].map(
        ([, number]) => Number(number)
      )
      expect(printedNumbers).toEqual(markers.map(([number]) => number))
      const [x, y, width, height] = box
      return markers.map(([booth, cx, cy]) => {
        expect(cx).toBeGreaterThan(x)
        expect(cx).toBeLessThan(x + width)
        expect(cy).toBeGreaterThan(y)
        expect(cy).toBeLessThan(y + height)
        return boothId(floor, booth)
      })
    })

    const assignments = PLACEMENTS.map(p => boothId(p.floor, p.booth))
    expect(new Set(markers).size).toBe(87)
    expect(new Set(assignments)).toEqual(new Set(markers))
    expect(
      assignments.filter((key, index) => assignments.indexOf(key) !== index)
    ).toEqual(["nymble-2-booth-62"])
  })

  it("keeps the two dated placements at booth 62 and provides names without a CMS record", () => {
    const placements = mapExhibitors([])
    expect(placements.filter(p => p.floor === 2 && p.booth === 62)).toEqual([
      expect.objectContaining({ name: "Handelsbanken", day: 17 }),
      expect.objectContaining({
        name: "Svenskt Kärntekniskt Centrum (SKC)",
        day: 18
      })
    ])
    expect(placements.find(p => p.name === "Epiroc")).toMatchObject({
      floor: 2,
      booth: 72
    })
    expect(placements.find(p => p.name === "Coherent")).toMatchObject({
      floor: 3,
      booth: 102
    })
  })
})
