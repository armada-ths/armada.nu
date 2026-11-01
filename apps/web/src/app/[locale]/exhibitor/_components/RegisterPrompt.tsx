import { uiSections } from "@/i18n/ui"
import { getSignupUrl } from "@/components/shared/feature"
import { Button } from "@/components/ui/button"
import { getRequestLocale } from "@/lib/i18n-server"
import { Link } from "@armada/shared/i18n/navigation"

export async function RegisterPrompt() {
  const locale = await getRequestLocale()
  const dict = uiSections[locale].registerPromptDict
  const signupUrl = await getSignupUrl()
  //maybe remove
  return (
    <div className="mt-2">
      <Link href={signupUrl}>
        <Button>{dict.signup}</Button>
      </Link>
      <p className="text-xs">
        {dict.or}{" "}
        <Link
          className="text-blue-600 hover:underline"
          href="mailto:sales@armada.nu">
          {dict.contact}
        </Link>{" "}
        {dict.suffix}
      </p>
    </div>
  )
}
