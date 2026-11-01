import { getLocale } from "@armada/shared/i18n/server"
import { normalizeLocale } from "@armada/shared/i18n/routing"
export async function getRequestLocale() {
  return normalizeLocale(await getLocale())
}
