import {
  FEATURE_FLAG_DEFINITIONS,
  getDefaultFeatureFlags,
  getExhibitorSignupEnabled,
  type FeatureFlagKey
} from "@/feature_flags"
import { env } from "@/env"
import { decryptOverrides } from "flags"
import { cookies } from "next/headers"

type FlagOverrideValues = Partial<Record<FeatureFlagKey, boolean>>

type PreviewFlagOverridesPayload = {
  default?: unknown
  branches?: unknown
  deployments?: unknown
}

function normalizeDeploymentKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
}

function parseFlagOverrides(input: unknown): FlagOverrideValues {
  if (!input || typeof input !== "object") {
    return {}
  }

  const knownFlagKeys = new Set(Object.keys(FEATURE_FLAG_DEFINITIONS))
  const parsed: FlagOverrideValues = {}

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (knownFlagKeys.has(key) && typeof value === "boolean") {
      parsed[key as FeatureFlagKey] = value
    }
  }

  return parsed
}

function parseMapEntryOverrides(
  mapValue: unknown,
  lookupKey?: string,
  normalizeKeys = false
): FlagOverrideValues {
  if (!lookupKey || !mapValue || typeof mapValue !== "object") {
    return {}
  }

  const map = mapValue as Record<string, unknown>
  if (!normalizeKeys) {
    return parseFlagOverrides(map[lookupKey])
  }

  const normalizedLookupKey = normalizeDeploymentKey(lookupKey)
  for (const [candidateKey, candidateValue] of Object.entries(map)) {
    if (normalizeDeploymentKey(candidateKey) === normalizedLookupKey) {
      return parseFlagOverrides(candidateValue)
    }
  }

  return {}
}

function getPreviewDeploymentOverrides(): FlagOverrideValues {
  if (process.env.VERCEL_ENV !== "preview") {
    return {}
  }

  if (!env.FEATURE_FLAG_PREVIEW_OVERRIDES_JSON) {
    return {}
  }

  try {
    const parsed = JSON.parse(
      env.FEATURE_FLAG_PREVIEW_OVERRIDES_JSON
    ) as PreviewFlagOverridesPayload

    const branch = process.env.VERCEL_GIT_COMMIT_REF
    const deployment = process.env.VERCEL_URL

    return {
      ...parseFlagOverrides(parsed.default),
      ...parseMapEntryOverrides(parsed.branches, branch),
      ...parseMapEntryOverrides(parsed.deployments, deployment, true)
    }
  } catch {
    return {}
  }
}

export async function features() {
  const baseFlags = await getDefaultFeatureFlags()
  const exhibitorSignupEnabled = await getExhibitorSignupEnabled(baseFlags)
  const previewOverrides = getPreviewDeploymentOverrides()
  const overrideCookie = (await cookies()).get("vercel-flag-overrides")?.value
  const overrides = overrideCookie ? await decryptOverrides(overrideCookie) : {}
  return {
    ...baseFlags,
    EXHIBITOR_SIGNUP: exhibitorSignupEnabled,
    ...previewOverrides,
    ...overrides
  }
}

export async function feature(feature: FeatureFlagKey) {
  return (await features())[feature] ?? false
}

export async function getSignupUrl() {
  const enabled = await feature("EXHIBITOR_SIGNUP")
  return enabled
    ? "https://app.eventro.se/register/armada"
    : "/exhibitor/signup"
}
