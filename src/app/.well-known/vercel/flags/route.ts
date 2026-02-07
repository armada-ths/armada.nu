import { type ApiData } from "flags"
import { createFlagsDiscoveryEndpoint } from "flags/next"
import { FEATURE_FLAG_DEFINITIONS } from "../../../../feature_flags"

export const GET = createFlagsDiscoveryEndpoint(async () => {
  const apiData: ApiData = {
    definitions: FEATURE_FLAG_DEFINITIONS
  }

  return apiData
})
