import { uiText } from "@/i18n/ui"
import { getSignupUrl } from "@/components/shared/feature"
import { Button } from "@/components/ui/button"
import { getRequestLocale } from "@/lib/i18n-server"
import { Link } from "@armada/shared/i18n/navigation"

export async function RegisterBanner() {
  const locale = await getRequestLocale()
  const signupUrl = await getSignupUrl()
  return (
    <div
      id="bottom-banner"
      tabIndex={-1}
      className="bg-melon fixed inset-s-0 bottom-0 z-50 flex w-full justify-between">
      <div className="p-4">
        <Link href={signupUrl}>
          <Button>{uiText(locale, "signupToArmada")}</Button>
        </Link>
      </div>
    </div>
  )
}
