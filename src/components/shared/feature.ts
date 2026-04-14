import { fetchDates, isExhibitorSignupOpen } from "@/components/shared/hooks/api/useDates"
import {
  getDefaultFeatureFlags,
  type FeatureFlagKey
} from "@/feature_flags"
import { decryptOverrides } from "flags"
import { cookies } from "next/headers"

export async function features() {
  const baseFlags = await getDefaultFeatureFlags()
  const overrideCookie = (await cookies()).get("vercel-flag-overrides")?.value
  const overrides = overrideCookie ? await decryptOverrides(overrideCookie) : {}
  return {
    ...baseFlags,
    ...overrides
  }
}

export async function feature(feature: FeatureFlagKey) {
  return (await features())[feature] ?? false
}

export async function getSignupUrl() {
  try {
    const dates = await fetchDates()
    return isExhibitorSignupOpen(dates)
      ? "https://app.eventro.se/register/armada"
      : "/exhibitor/signup"
  } catch {
    return "/exhibitor/signup"
  }
}
