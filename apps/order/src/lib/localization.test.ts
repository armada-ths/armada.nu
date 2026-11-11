import { describe, expect, it } from "vitest"
import { createTranslator } from "next-intl"
import { localizedText } from "@armada/shared/i18n/routing"
import en from "../i18n/messages/en.json"
import sv from "../i18n/messages/sv.json"
function flat(value: object, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) =>
      typeof item === "string"
        ? [[prefix + key, item]]
        : Object.entries(flat(item, prefix + key + "."))
    )
  )
}
describe("order translations", () => {
  it("uses per-field CMS translations with English fallback", () => {
    expect(localizedText("sv", "Coffee", "Kaffe")).toBe("Kaffe")
    expect(localizedText("sv", "Coffee", null)).toBe("Coffee")
    expect(localizedText("en", "Coffee", "Kaffe")).toBe("Coffee")
  })
  it("has matching messages and valid placeholders", () => {
    expect(Object.keys(flat(en)).sort()).toEqual(Object.keys(flat(sv)).sort())
    for (const [locale, messages] of Object.entries({ en, sv }) as [
      "en" | "sv",
      typeof en
    ][]) {
      const errors: unknown[] = []
      const t = createTranslator({
        locale,
        messages,
        onError: error => errors.push(error)
      })
      for (const [key, message] of Object.entries(flat(messages))) {
        const args = Object.fromEntries(
          [...message.matchAll(/\{(\w+)\}/g)].map(([, name]) => [
            name,
            "Example"
          ])
        )
        t(key as Parameters<typeof t>[0], args)
      }
      expect(errors).toEqual([])
    }
  })
})
