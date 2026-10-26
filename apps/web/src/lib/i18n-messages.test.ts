import { createTranslator } from "next-intl"
import { describe, it, expect } from "vitest"
import en from "../i18n/messages/en.json"
import sv from "../i18n/messages/sv.json"

function flatten(value: object, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) => {
      const path = prefix ? prefix + "." + key : key
      return typeof item === "string"
        ? [[path, item]]
        : Object.entries(flatten(item, path))
    })
  )
}
describe("published English and Swedish messages", () => {
  it("provides the same keys in both languages", () =>
    expect(Object.keys(flatten(en)).sort()).toEqual(
      Object.keys(flatten(sv)).sort()
    ))
  it.each([
    ["en", en],
    ["sv", sv]
  ] as const)(
    "formats every %s message, including plural forms",
    (locale, messages) => {
      const errors: unknown[] = []
      const t = createTranslator({
        locale,
        messages,
        onError: error => errors.push(error)
      })
      for (const [key, text] of Object.entries(flatten(messages))) {
        const numeric = new Set(
          [...text.matchAll(/\{(\w+),\s*(?:plural|selectordinal|number)/g)].map(
            ([, name]) => name
          )
        )
        const args = Object.fromEntries(
          [...text.matchAll(/\{(\w+)(?:[,}])/g)].map(([, name]) => [
            name,
            numeric.has(name) ||
            ["count", "days", "year", "hours", "minutes", "seconds"].includes(
              name
            )
              ? 2
              : name
          ])
        )
        t(key as Parameters<typeof t>[0], args)
      }
      expect(errors.map(String)).toEqual([])
    }
  )
})
