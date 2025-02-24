import { Button } from "@/components/ui/button"
import Link from "next/link"

export function RegisterBanner() {
  return (
    <div
      id="bottom-banner"
      tabIndex={-1}
      className="fixed bottom-0 start-0 z-50 flex w-full justify-between bg-melon-700">
      <div className="p-4">
        <Link href="https://app.eventro.se/organization/armada/home">
          <Button>Signup to armada</Button>
        </Link>
      </div>
    </div>
  )
}
