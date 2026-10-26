import { afterEach, describe, expect, it, vi } from "vitest"
import { isProductionDeployment } from "./deployment"
import robots from "../app/robots"
import sitemap from "../app/sitemap"
import photosRobots from "../../../photos/src/app/robots"
import orderRobots from "../../../order/src/app/robots"
import { getDefaultFeatureFlags } from "@/feature_flags"

vi.mock("@/feature_flags", () => ({
  getDefaultFeatureFlags: vi.fn(async () => ({}))
}))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

vi.mock("next-intl/plugin", () => ({
  default: () => (config: unknown) => config
}))

describe("deployment indexing policy", () => {
  it.each([
    ["photos", photosRobots],
    ["order", orderRobots]
  ] as const)(
    "allows crawlers to read the %s noindex header",
    async (app, appRobots) => {
      expect(appRobots()).toEqual({ rules: { userAgent: "*", allow: "/" } })
      const configPath = `../../../${app}/next.config.mjs`
      const { default: config } = await import(configPath)
      expect(await config.headers()).toContainEqual(
        expect.objectContaining({
          source: "/:path*",
          headers: expect.arrayContaining([
            { key: "X-Robots-Tag", value: "noindex, nofollow" }
          ])
        })
      )
    }
  )

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

  it("allows production crawling and excludes the team from the sitemap", async () => {
    vi.stubEnv("VERCEL_ENV", "production")
    expect(isProductionDeployment()).toBe(true)
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://armada.nu/sitemap.xml"
    })
    expect(await sitemap()).toContainEqual(
      expect.objectContaining({ url: "https://armada.nu/en" })
    )
    vi.mocked(getDefaultFeatureFlags, { partial: true }).mockResolvedValueOnce({
      ABOUT_TEAM_PAGE: true
    })
    expect(await sitemap()).not.toContainEqual(
      expect.objectContaining({ url: "https://armada.nu/about/team" })
    )
    expect(getDefaultFeatureFlags).toHaveBeenCalledTimes(2)
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
