import type { Metadata } from "next"
import Link from "next/link"
import { Page } from "@armada/shared/Page"
import { CookieInformation } from "@armada/shared/CookieInformation"

export const metadata: Metadata = {
  title: "Cookies & browser storage | THS Armada",
  description: "How this website uses cookies and browser storage."
}

export default function CookiesPage() {
  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={760} className="gap-8">
        <Link href="/" className="text-sm underline underline-offset-4">
          Back to Armada
        </Link>
        <Page.Header>Cookies & browser storage</Page.Header>
        <CookieInformation site="web" />
      </Page.Boundary>
    </Page.Background>
  )
}
