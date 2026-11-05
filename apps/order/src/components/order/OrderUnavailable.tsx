"use client"
import { useTranslations } from "next-intl"
import type { OrderErrorCode } from "@order/lib/orders"
import { useRouter } from "next/navigation"
import { Button } from "@armada/shared/ui/button"
export function OrderUnavailable({ code }: { code: OrderErrorCode }) {
  const router = useRouter()
  const t = useTranslations("Order"),
    errors = useTranslations("OrderErrors")
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold">{t("heading")}</h1>
      <p className="mt-4">{errors(code)}</p>
      {code === "availability_unavailable" && (
        <Button className="mt-4" onClick={() => router.refresh()}>
          {t("retry")}
        </Button>
      )}
    </main>
  )
}
