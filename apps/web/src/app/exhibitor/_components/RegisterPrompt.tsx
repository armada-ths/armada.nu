import { getSignupUrl } from "@/components/shared/feature"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function RegisterPrompt() {
  const signupUrl = await getSignupUrl()
  //maybe remove
  return (
    <div className="mt-2">
      <Link href={signupUrl}>
        <Button>Signup to armada</Button>
      </Link>
      <p className="text-xs">
        Or{" "}
        <Link
          className="text-blue-600 hover:underline"
          href="mailto:sales@armada.nu">
          contact sales
        </Link>{" "}
        if you have any questions
      </p>
    </div>
  )
}
