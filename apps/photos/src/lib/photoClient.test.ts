import { afterEach, describe, expect, it, vi } from "vitest"
import { createPhotoID, photoStorageURL } from "./photoClient"

describe("LAN photo clients", () => {
  afterEach(() => vi.restoreAllMocks())

  it("uses the native UUID method when available", () => {
    const uuid = "9d96fcb0-6ec8-4eae-9050-c660d39fdd77"
    const native = vi.spyOn(crypto, "randomUUID").mockReturnValue(uuid)
    const fallback = vi.spyOn(crypto, "getRandomValues")
    expect(createPhotoID()).toBe(uuid)
    expect(native).toHaveBeenCalledOnce()
    expect(fallback).not.toHaveBeenCalled()
  })

  it("creates distinct UUIDs without the secure-context randomUUID API", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: crypto.getRandomValues.bind(crypto)
    })
    try {
      const first = createPhotoID()
      expect(first).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      )
      expect(createPhotoID()).not.toBe(first)
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it("proxies local signed storage URLs without changing their signature", () => {
    const url =
      "http://127.0.0.1:54321/storage/v1/s3/event-photos/test.jpg?X-Amz-Signature=abc%2F123"
    expect(photoStorageURL(url, true)).toBe(
      "/local-photo-storage/storage/v1/s3/event-photos/test.jpg?X-Amz-Signature=abc%2F123"
    )
    expect(photoStorageURL(url, false)).toBe(url)
    const hosted = "https://storage.example.com/photo.jpg?signature=123"
    expect(photoStorageURL(hosted, true)).toBe(hosted)
    expect(photoStorageURL("/icons/photo.svg", true)).toBe("/icons/photo.svg")
  })
})
