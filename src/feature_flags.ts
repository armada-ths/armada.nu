import { env } from "@/env"
import { FlagDefinitionsType } from "flags"

export const FEATURE_FLAG_DEFINITIONS = {
  EVENT_PAGE: {
    description: "Access to Event Page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  MAP_PAGE: {
    description: "Access to Map Page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  AT_FAIR_PAGE: {
    description: "Access to At the Fair Page",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  EXHIBITOR_SIGNUP: {
    description:
      "Exhibitor signup links. When enabled, links go to Eventro. When disabled, links go to /exhibitor/signup (coming soon page).",
    options: [
      { value: true, label: "Open" },
      { value: false, label: "Closed" }
    ]
  },
  EXHIBITOR_PACKAGES: {
    description: "Exhibitor packages page content",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  },
  EXHIBITOR_EVENTS: {
    description: "Exhibitor events page content",
    options: [
      { value: true, label: "Show" },
      { value: false, label: "Hidden" }
    ]
  }
} satisfies FlagDefinitionsType

export type FeatureFlagKey = keyof typeof FEATURE_FLAG_DEFINITIONS
export type FeatureFlags = Record<FeatureFlagKey, boolean>

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
  options?: RequestInit
): Promise<FeatureFlags> {
  if (!env.NEXT_PUBLIC_API_URL) {
    return createFallbackFlags()
  }

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/featureflags`, {
    cache: "no-store",
    ...options,
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

export async function getExhibitorSignupEnabled(defaults?: FeatureFlags) {
  const baseFlags = defaults ?? (await getDefaultFeatureFlags())
  return baseFlags.EXHIBITOR_SIGNUP
}

export async function getSignupUrl() {
  return (await getExhibitorSignupEnabled())
    ? "https://app.eventro.se/register/armada"
    : "/exhibitor/signup"
}

export default FEATURE_FLAG_DEFINITIONS
