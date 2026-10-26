import { describe, expect, it } from "vitest"
import { createTranslator } from "next-intl"
import { ITEMS } from "./catalogue"
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
  it("covers every product ID while keeping catalog rules in the catalog", () => {
    const ids = ITEMS.map(item => item.id).sort()
    expect(Object.keys(en.Products).sort()).toEqual(ids)
    expect(Object.keys(sv.Products).sort()).toEqual(ids)
  })
  it("has matching messages and valid placeholders", () => {
    expect(Object.keys(flat(en)).sort()).toEqual(Object.keys(flat(sv)).sort())
    for (const [locale, messages] of Object.entries({ en, sv })) {
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
