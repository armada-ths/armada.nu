import { Button } from "@/components/ui/button"
import { SIGNUP_URL } from "@/feature_flags"
import Link from "next/link"

export function RegisterPrompt() {
  //maybe remove
  return (
    <div className="mt-2">
      <Link href={SIGNUP_URL}>
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
