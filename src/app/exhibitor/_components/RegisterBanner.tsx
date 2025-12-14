import { Button } from "@/components/ui/button"
import Link from "next/link"

export function RegisterBanner() {
  return (
    <div
      id="bottom-banner"
      tabIndex={-1}
      className="bg-melon-700 fixed start-0 bottom-0 z-50 flex w-full justify-between">
      <div className="p-4">
        <Link href="https://app.eventro.se/register/armada">
          <Button>Signup to armada</Button>
        </Link>
      </div>
    </div>
  )
}
