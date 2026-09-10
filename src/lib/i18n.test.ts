import { describe, expect, it } from "vitest"

import {
  createLocalePath,
  getLocaleFromPathname,
  normalizeLocale,
  stripLocalePrefix
} from "./i18n"

describe("i18n helpers", () => {
  it("normalizes supported locales", () => {
    expect(normalizeLocale("sv")).toBe("sv")
    expect(normalizeLocale("en-US")).toBe("en")
    expect(normalizeLocale("fr")).toBe("en")
  })

  it("removes an existing locale prefix from a pathname", () => {
    expect(stripLocalePrefix("/sv/about")).toBe("/about")
    expect(stripLocalePrefix("/en/student/recruitment")).toBe(
      "/student/recruitment"
    )
    expect(stripLocalePrefix("/about")).toBe("/about")
  })

  it("builds locale-prefixed URLs for the current path", () => {
    expect(createLocalePath("/about", "sv")).toBe("/sv/about")
    expect(createLocalePath("/student/recruitment", "en")).toBe(
      "/en/student/recruitment"
    )
    expect(createLocalePath("/", "sv")).toBe("/sv")
  })

  it("reads the locale from a locale-prefixed pathname", () => {
    expect(getLocaleFromPathname("/sv/about")).toBe("sv")
    expect(getLocaleFromPathname("/en")).toBe("en")
    expect(getLocaleFromPathname("/about")).toBe("en")
  })
})
