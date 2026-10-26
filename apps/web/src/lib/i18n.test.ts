import { describe, expect, it } from "vitest"
import {
  createLocalePath,
  normalizeLocale,
  resolveLocalizedHighlightCardCopy,
  stripLocalePrefix
} from "./i18n"
describe("locale URLs and CMS copy", () => {
  it("matches regional Swedish and defaults to English", () => {
    expect(normalizeLocale("sv-SE")).toBe("sv")
    expect(normalizeLocale("en-GB")).toBe("en")
    expect(normalizeLocale("fr")).toBe("en")
  })
  it("keeps query and fragment while replacing the prefix", () => {
    expect(createLocalePath("/en/student/events?id=17#details", "sv")).toBe(
      "/sv/student/events?id=17#details"
    )
    expect(createLocalePath(null, "sv")).toBe("/sv")
    expect(stripLocalePrefix("/svenska")).toBe("/svenska")
  })
  it("falls back independently for absent or blank Swedish fields", () => {
    expect(
      resolveLocalizedHighlightCardCopy("sv", {
        title: "Original",
        titleSv: " Svenska ",
        subtitle: "Subtitle",
        subtitleSv: "  ",
        description: "Body",
        linkText: "Read",
        linkTextSv: "Läs"
      })
    ).toEqual({
      title: "Svenska",
      subtitle: "Subtitle",
      description: "Body",
      linkText: "Läs"
    })
  })
  it("keeps original CMS text without string matching", () => {
    const card = {
      title: "Who will you meet?",
      description: "Original",
      titleSv: "Svenska",
      linkText: "Read",
      linkTextSv: "Läs"
    }
    expect(resolveLocalizedHighlightCardCopy("en", card)).toEqual({
      title: card.title,
      subtitle: undefined,
      description: card.description,
      linkText: "Read"
    })
    expect(
      resolveLocalizedHighlightCardCopy("sv", { title: card.title })
    ).toEqual({
      title: card.title,
      subtitle: undefined,
      description: undefined,
      linkText: undefined
    })
  })
})
