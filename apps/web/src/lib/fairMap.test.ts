import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import {
  MAPS,
  PLACEMENTS,
  boothId,
  getExhibitorPlacement,
  mapExhibitors
} from "@/components/map/maps"

describe("2026 fair map", () => {
  it("assigns every verified exhibitor to a unique placement on one of the two SVG floors", () => {
    expect(MAPS.map(({ floor, markers }) => [floor, markers.length])).toEqual([
      [2, 65],
      [3, 22]
    ])
    expect(PLACEMENTS).toHaveLength(88)
    expect(new Set(PLACEMENTS.map(p => p.id)).size).toBe(88)

    const markers = MAPS.flatMap(({ floor, box, markers }) => {
      const svg = readFileSync(
        new URL(`../../public/fair-map/nymble-${floor}.svg`, import.meta.url),
        "utf8"
      )
      expect(svg).toContain(`viewBox="${box.join(" ")}"`)
      expect(svg).not.toContain("data-booth-label=")
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

  it("resolves all placements by identity when the CMS assigns different IDs", () => {
    const exhibitors = PLACEMENTS.map(
      ({ id, companyWebsite, name }, index) => ({
        id: 10001 + index,
        eventroId: companyWebsite ? undefined : id,
        companyWebsite,
        name,
        type: "company",
        climateCompensation: false
      })
    )

    expect(PLACEMENTS.filter(p => p.companyWebsite).map(p => p.id)).toEqual([
      "f1rst"
    ])
    expect(mapExhibitors(exhibitors).map(p => p.exhibitor?.id)).toEqual(
      exhibitors.map(exhibitor => exhibitor.id)
    )
    const f1rst = exhibitors.find(exhibitor => exhibitor.name === "F1rst")!
    expect(
      getExhibitorPlacement({ ...f1rst, companyWebsite: "https://f1rst.se/" })
    ).toMatchObject({ booth: 87 })
    expect(
      getExhibitorPlacement({
        ...f1rst,
        companyWebsite: "https://example.test/"
      })
    ).toBeUndefined()
    expect(
      getExhibitorPlacement({ ...f1rst, eventroId: "unrelated" })
    ).toBeUndefined()
  })

  it("only maps CMS exhibitors, including at a booth shared across days", () => {
    const placement = PLACEMENTS.find(p => p.name === "Handelsbanken")!
    const exhibitor = {
      id: 10001,
      eventroId: placement.id,
      name: "Handelsbanken",
      type: "company" as const,
      climateCompensation: false
    }

    expect(mapExhibitors([exhibitor])).toEqual([
      expect.objectContaining({ floor: 2, booth: 62, day: 17, exhibitor })
    ])
    expect(mapExhibitors([])).toEqual([])
  })
})
