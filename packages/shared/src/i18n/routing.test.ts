import { describe, expect, expectTypeOf, it } from "vitest"
import {
  localePath,
  localizedText,
  normalizeLocale,
  stripLocalePrefix
} from "./routing"

describe("locale routing", () => {
  it("matches regional Swedish and defaults to English", () => {
    expect(normalizeLocale("sv-SE")).toBe("sv")
    expect(normalizeLocale("en-GB")).toBe("en")
    expect(normalizeLocale("fr")).toBe("en")
  })
  it("keeps query and fragment while replacing the prefix", () => {
    expect(localePath("/en/student/events?id=17#details", "sv")).toBe(
      "/sv/student/events?id=17#details"
    )
    expect(localePath("/", "sv")).toBe("/sv")
    expect(stripLocalePrefix("/svenska")).toBe("/svenska")
  })
})

describe("localizedText", () => {
  it("uses nonempty Swedish text only for Swedish", () => {
    expect(localizedText("sv", "Original", " Svenska ")).toBe("Svenska")
    expect(localizedText("en", "Original", "Svenska")).toBe("Original")
    for (const missing of [null, undefined, "", "  "]) {
      expect(localizedText("sv", "Original", missing)).toBe("Original")
    }
  })
  it("preserves missing originals and their return types", () => {
    expect(localizedText("sv", null, null)).toBeNull()
    expect(localizedText("sv", undefined, undefined)).toBeUndefined()
    expectTypeOf(localizedText("sv", "Original", null)).toEqualTypeOf<string>()
    const optional = undefined as string | null | undefined
    expectTypeOf(localizedText("sv", optional, null)).toEqualTypeOf<
      string | null | undefined
    >()
  })
})
