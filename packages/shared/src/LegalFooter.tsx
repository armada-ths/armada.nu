import Link from "next/link"
import { cn } from "./cn"

export function LegalFooter({ site }: { site: "photos" | "order" }) {
  return (
    <footer
      className={cn(
        "border-t px-5 py-6 text-sm",
        site === "photos"
          ? "border-slate-200 text-[#172b35]"
          : "border-border text-foreground"
      )}>
      <nav
        aria-label="Legal information"
        className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-3">
        {site === "photos" && (
          <Link className="underline underline-offset-4" href="/privacy">
            Privacy notice
          </Link>
        )}
        <Link
          className="underline underline-offset-4"
          href={site === "photos" ? "/privacy#cookies" : "/cookies"}>
          Cookies & browser storage
        </Link>
      </nav>
    </footer>
  )
}
