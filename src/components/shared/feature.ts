import featureFlags from "@/feature_flags"
import Cookies from "js-cookie"

export function feature(feature: keyof typeof featureFlags) {
	let rawOverrides = Cookies.get("vercel-flag-overrides")

	const overrides =
		rawOverrides == null
			? {}
			: (JSON.parse(rawOverrides) as Record<string, boolean>)

	if (overrides[feature] != null) {
		return overrides[feature]
	} else if (featureFlags[feature] != null) {
		return featureFlags[feature]
	}
	return false
}
const test = "test"
