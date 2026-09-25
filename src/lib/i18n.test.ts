import { describe, expect, it } from "vitest"

import {
  createLocalePath,
  getLocaleFromPathname,
  localizeHighlightCardCopy,
  normalizeLocale,
  pageTranslations,
  resolveLocalizedHighlightCardCopy,
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

  it("uses the correct homepage marketing copy in both languages", () => {
    expect(pageTranslations.en.home.heroDescription).toBe(
      "Scandinavia's largest student-driven career fair"
    )
    expect(pageTranslations.sv.home.heroDescription).toBe(
      "Nordens största studentdrivna arbetsmarknadsmässa"
    )
    expect(pageTranslations.sv.home.visitorLabels.visits).toBe("besökare")
    expect(pageTranslations.sv.home.visitorLabels.networking).toBe(
      "dagar med nätverkande"
    )
  })

  it("uses Swedish countdown labels on the homepage", () => {
    expect(pageTranslations.en.home.countdownLabels).toEqual({
      days: "Days",
      hours: "Hours",
      minutes: "Mins",
      seconds: "Secs",
      fairIsLive: "The Fair Is Live!"
    })
    expect(pageTranslations.sv.home.countdownLabels).toEqual({
      days: "Dagar",
      hours: "Timmar",
      minutes: "Min",
      seconds: "Sek",
      fairIsLive: "Mässan är live!"
    })
  })

  it("localizes the homepage exhibitor highlight card from CMS copy", () => {
    expect(
      localizeHighlightCardCopy("sv", {
        title: "Who will you meet?",
        subtitle: "The ARMADA 2026 exhibitor lineup is coming soon",
        description:
          "We’re getting ready to reveal this year’s companies. Stay tuned and be among the first to discover who you can meet at ARMADA."
      })
    ).toEqual({
      title: "Vem kommer du träffa?",
      subtitle: "Lineupen för 2026 kommer snart",
      description:
        "Vi kommer snart publicera årets företag. Håll utkik och var bland de första som får se vilka du kan träffa på ARMADA."
    })
  })

  it("prefers CMS-provided Swedish fields over the legacy fallback text", () => {
    expect(
      resolveLocalizedHighlightCardCopy("sv", {
        title: "Who will you meet?",
        titleSv: "Vem är du sugen på att träffa?",
        subtitle: "The ARMADA 2026 exhibitor lineup is coming soon",
        subtitleSv: "Håll utkik efter 2026 års utställare",
        description: "We’re getting ready to reveal this year’s companies.",
        descriptionSv: "Vi förbereder presentationen av årets företag."
      })
    ).toEqual({
      title: "Vem är du sugen på att träffa?",
      subtitle: "Håll utkik efter 2026 års utställare",
      description: "Vi förbereder presentationen av årets företag."
    })
  })

  it("falls back to legacy exact-match translations when Swedish CMS fields are absent", () => {
    expect(
      resolveLocalizedHighlightCardCopy("sv", {
        title: "Who will you meet?",
        subtitle: "The ARMADA 2026 exhibitor lineup is coming soon",
        description:
          "We’re getting ready to reveal this year’s companies. Stay tuned and be among the first to discover who you can meet at ARMADA."
      })
    ).toEqual({
      title: "Vem kommer du träffa?",
      subtitle: "Lineupen för 2026 kommer snart",
      description:
        "Vi kommer snart publicera årets företag. Håll utkik och var bland de första som får se vilka du kan träffa på ARMADA."
    })
  })

  it("passes English content through untouched", () => {
    expect(
      resolveLocalizedHighlightCardCopy("en", {
        title: "Who will you meet?",
        titleSv: "Vem kommer du träffa?",
        subtitle: "The ARMADA 2026 exhibitor lineup is coming soon",
        description: "We’re getting ready to reveal this year’s companies."
      })
    ).toEqual({
      title: "Who will you meet?",
      subtitle: "The ARMADA 2026 exhibitor lineup is coming soon",
      description: "We’re getting ready to reveal this year’s companies."
    })
  })
})
