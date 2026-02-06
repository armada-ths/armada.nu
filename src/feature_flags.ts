import { FlagDefinitionsType } from "@vercel/flags"

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

export const FEATURE_FLAGS: Record<
  keyof typeof FEATURE_FLAG_DEFINITIONS,
  boolean
> = {
  EVENT_PAGE: true,
  MAP_PAGE: false,
  AT_FAIR_PAGE: true,
  EXHIBITOR_SIGNUP: false,
  EXHIBITOR_PACKAGES: false,
  EXHIBITOR_EVENTS: false
}

export const SIGNUP_URL = FEATURE_FLAGS.EXHIBITOR_SIGNUP
  ? "https://app.eventro.se/register/armada"
  : "/exhibitor/signup"
export default FEATURE_FLAGS
