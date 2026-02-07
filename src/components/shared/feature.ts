import featureFlags, { FEATURE_FLAGS, getExhibitorSignupEnabled } from "@/feature_flags"
import { decryptOverrides } from "flags"
import { cookies } from "next/headers"

export async function features() {
  const exhibitorSignupEnabled = await getExhibitorSignupEnabled()
  const overrideCookie = (await cookies()).get("vercel-flag-overrides")?.value
  const overrides = overrideCookie
    ? (await decryptOverrides(overrideCookie))
    : {}
  const baseFlags = {
    ...FEATURE_FLAGS,
    EXHIBITOR_SIGNUP: exhibitorSignupEnabled
  }
  return {
    ...baseFlags,
    ...overrides
  }
}

export async function feature(feature: keyof typeof featureFlags) {
  return (await features())[feature] ?? false
}

export async function getSignupUrl() {
  const enabled = await feature("EXHIBITOR_SIGNUP")
  return enabled
    ? "https://app.eventro.se/register/armada"
    : "/exhibitor/signup"
}
