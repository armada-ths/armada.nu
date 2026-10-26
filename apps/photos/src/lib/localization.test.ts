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
describe("Photos English and Swedish messages", () => {
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

import {
  photoAPIError,
  photoErrorCode,
  PhotoError,
  photoErrorCodes
} from "./photoErrors"
import { redactAppTelemetry } from "@armada/shared/telemetry-utils"
import { config } from "../proxy"
describe("photo API errors", () => {
  it.each(photoErrorCodes)("translates code %s", code => {
    expect(en.PhotoErrors[code]).toBeTruthy()
    expect(sv.PhotoErrors[code]).toBeTruthy()
    expect(
      photoAPIError({ headers: new Headers({ "X-Armada-Error-Code": code }) })
        .code
    ).toBe(code)
    expect(photoAPIError({ getResponseHeader: () => code }).code).toBe(code)
  })
  it("does not parse server text or expose unknown errors", () => {
    expect(photoAPIError({ headers: new Headers() }).code).toBe("unknown_error")
    expect(
      photoAPIError({ getResponseHeader: () => "new_server_code" }).code
    ).toBe("unknown_error")
    expect(
      photoErrorCode(new Error("private backend detail"), "network_error")
    ).toBe("network_error")
    expect(photoErrorCode(new PhotoError("verification_failed"))).toBe(
      "verification_failed"
    )
  })
  it("explicitly matches event tokens containing dots", () => {
    expect(config.matcher).toEqual(
      expect.arrayContaining(["/e/:token", "/en/e/:token", "/sv/e/:token"])
    )
  })
  it.each(["en", "sv"])("redacts %s event tokens and query data", locale => {
    expect(
      redactAppTelemetry(
        {
          url: `https://photos.armada.nu/${locale}/e/private.token?guest_id=secret#photo`,
          route: `/${locale}/e/private.token`
        },
        "photos"
      )
    ).toEqual({
      url: `https://photos.armada.nu/${locale}/e/:redacted`,
      route: `/${locale}/e/:redacted`
    })
  })
})
