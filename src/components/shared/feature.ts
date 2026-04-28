import {
  fetchDates,
  isExhibitorSignupOpen
} from "@/components/shared/hooks/api/useDates"
import { getDefaultFeatureFlags, type FeatureFlagKey } from "@/feature_flags"
import { decryptOverrides } from "flags"
import { cookies } from "next/headers"
import { cache } from "react"

const getFlagOverrides = cache(async () => {
  const overrideCookie = (await cookies()).get("vercel-flag-overrides")?.value
  return overrideCookie ? await decryptOverrides(overrideCookie) : {}
})

export const features = cache(async () => {
  const [baseFlags, overrides] = await Promise.all([
    getDefaultFeatureFlags(),
    getFlagOverrides()
  ])

  return {
    ...baseFlags,
    ...overrides
  }
})

export async function feature(feature: FeatureFlagKey) {
  return (await features())[feature] ?? false
}

export const getSignupUrl = cache(async () => {
  try {
    const dates = await fetchDates()
    return isExhibitorSignupOpen(dates)
      ? "https://app.eventro.se/register/armada"
      : "/exhibitor/signup"
  } catch {
    return "/exhibitor/signup"
  }
})
