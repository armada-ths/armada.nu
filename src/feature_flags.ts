import { env } from "@/env"
import { FlagDefinitionsType } from "flags"

export const FEATURE_FLAG_DEFINITIONS = {
  EVENT_PAGE: {
    description: "Show the student events page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  MAP_PAGE: {
    description: "Show the fair map page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  AT_FAIR_PAGE: {
    description: "Show the at-the-fair student page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  EXHIBITOR_PACKAGES: {
    description: "Show the exhibitor packages page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  EXHIBITOR_EVENTS: {
    description: "Show the exhibitor events page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  EXHIBITOR_PAGE: {
    description: "Show the student exhibitors/companies page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  }
} satisfies FlagDefinitionsType

export type FeatureFlagKey = keyof typeof FEATURE_FLAG_DEFINITIONS
export type FeatureFlags = Record<FeatureFlagKey, boolean>

type FeatureFlagFetchOptions = RequestInit & {
  next?: {
    revalidate?: number
    tags?: string[]
  }
}

const FEATURE_FLAGS_REVALIDATE_SECONDS = 60

const createFallbackFlags = (): FeatureFlags => {
  return (Object.keys(FEATURE_FLAG_DEFINITIONS) as FeatureFlagKey[]).reduce(
    (acc, key) => {
      acc[key] = true
      return acc
    },
    {} as FeatureFlags
  )
}

export async function fetchFeatureFlags(
  options?: FeatureFlagFetchOptions
): Promise<FeatureFlags> {
  if (!env.NEXT_PUBLIC_API_URL) {
    return createFallbackFlags()
  }

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/featureflags`, {
    ...options,
    next: {
      revalidate: FEATURE_FLAGS_REVALIDATE_SECONDS,
      ...options?.next
    },
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch feature flags: ${res.status}`)
  }

  const data = (await res.json()) as Array<{
    key: FeatureFlagKey
    enabled: boolean
  }>

  const flags = createFallbackFlags()
  for (const flag of data) {
    if (flag?.key in flags) {
      flags[flag.key] = Boolean(flag.enabled)
    }
  }

  return flags
}

export async function getDefaultFeatureFlags(): Promise<FeatureFlags> {
  try {
    return await fetchFeatureFlags()
  } catch {
    return createFallbackFlags()
  }
}

export default FEATURE_FLAG_DEFINITIONS
