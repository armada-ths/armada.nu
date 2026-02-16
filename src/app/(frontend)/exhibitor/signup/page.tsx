import { Page } from "@/components/shared/Page"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Exhibitor Signup - Armada`,
  description: "Signup to exhibit at Armada"
}

export default function SignupPage() {
  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-[600px] text-center">
          <Page.Header>Exhibitor Signup</Page.Header>
          <p className="mt-4">
            Signup is not open yet. Check back soon for registration details!
          </p>
          <p className="mt-4">
            In the meantime, feel free to explore our{" "}
            <Link className="underline hover:no-underline" href="/exhibitor">
              exhibitor information
            </Link>{" "}
            or contact{" "}
            <Link
              className="underline hover:no-underline"
              href="mailto:sales@armada.nu">
              sales@armada.nu
            </Link>{" "}
            if you have any questions.
          </p>
          <div className="mt-6">
            <Button asChild variant="neutral">
              <Link href="/exhibitor">Back to Exhibitor Info</Link>
            </Button>
          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
