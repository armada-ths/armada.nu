import { features } from "@/components/shared/feature"
import { DevToolbarClient } from "./VercelToolbarClient"

export async function DevToolbar() {
  const featureFlags = await features()
  return <DevToolbarClient featureFlags={featureFlags} />
}
