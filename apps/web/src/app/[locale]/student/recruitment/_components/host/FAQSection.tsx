import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { getRequestLocale } from "@/lib/i18n-server"

import { FAQSectionContent } from "./FAQSectionContent"

export async function FAQSection() {
  const locale = await getRequestLocale()
  const dates = await fetchDates()

  return <FAQSectionContent locale={locale} fairDays={dates?.fair.days ?? []} />
}
