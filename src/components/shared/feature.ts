import {
  getDefaultFeatureFlags,
  getExhibitorSignupEnabled,
  type FeatureFlagKey
} from "@/feature_flags"
import { decryptOverrides } from "flags"
import { cookies } from "next/headers"

export async function features() {
  const baseFlags = await getDefaultFeatureFlags()
  const exhibitorSignupEnabled = await getExhibitorSignupEnabled(baseFlags)
  const overrideCookie = (await cookies()).get("vercel-flag-overrides")?.value
  const overrides = overrideCookie
    ? (await decryptOverrides(overrideCookie))
    : {}
  return {
    ...baseFlags,
    EXHIBITOR_SIGNUP: exhibitorSignupEnabled,
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
