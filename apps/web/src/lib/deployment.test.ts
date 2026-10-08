import { afterEach, describe, expect, it, vi } from "vitest"
import { isProductionDeployment } from "./deployment"
import robots from "../app/robots"
import sitemap from "../app/sitemap"
import { getDefaultFeatureFlags } from "@/feature_flags"

vi.mock("@/feature_flags", () => ({
  getDefaultFeatureFlags: vi.fn(async () => ({}))
}))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe("deployment indexing policy", () => {
  it.each(["preview", "development", "staging", undefined])(
    "does not expose a sitemap for %s deployments",
    async environment => {
      vi.stubEnv("VERCEL_ENV", environment)
      vi.stubEnv("NODE_ENV", "production")
      expect(isProductionDeployment()).toBe(false)
      expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/" } })
      expect(await sitemap()).toEqual([])
      expect(getDefaultFeatureFlags).not.toHaveBeenCalled()
    }
  )

  it("preserves production robots and sitemap", async () => {
    vi.stubEnv("VERCEL_ENV", "production")
    expect(isProductionDeployment()).toBe(true)
    expect(robots()).toEqual({
      rules: [{ userAgent: "*", disallow: "/about/team" }],
      sitemap: "https://armada.nu/sitemap.xml"
    })
    expect(await sitemap()).toContainEqual(
      expect.objectContaining({ url: "https://armada.nu" })
    )
    expect(getDefaultFeatureFlags).toHaveBeenCalledOnce()
  })

  it.each(["preview", undefined, "production"])(
    "applies staging headers without disabling production indexing (%s)",
    async environment => {
      vi.stubEnv("VERCEL_ENV", environment)
      // A variable import path lets TypeScript leave this JavaScript config to
      // Next.js; the test checks the actual exported header configuration.
      const configPath = "../../next.config.mjs"
      const { default: config } = await import(configPath)
      const rules = await config.headers()
      const stagingRule = rules.find(
        (rule: { has?: { type: string; value: string }[] }) =>
          rule.has?.some(match => match.value === "staging\\.armada\\.nu")
      )
      expect(stagingRule.headers).toEqual(
        expect.arrayContaining([
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" }
        ])
      )
      expect(rules.some((rule: { has?: unknown }) => !rule.has)).toBe(
        environment !== "production"
      )
    }
  )
})
