import { FlagDefinitionsType } from "@vercel/flags"

export const FEATURE_FLAG_DEFINITIONS = {
	EVENT_PAGE: {
		description: "Access to Event Page",
		options: [
			{ value: true, label: "Show" },
			{ value: false, label: "Hidden" }
		]
	}
} satisfies FlagDefinitionsType

export const FEATURE_FLAGS: Record<
	keyof typeof FEATURE_FLAG_DEFINITIONS,
	boolean
> = {
	EVENT_PAGE: false
}

export default FEATURE_FLAGS
