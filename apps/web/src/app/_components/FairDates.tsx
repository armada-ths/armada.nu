import { getLocale } from "next-intl/server"
import { LocalizedText } from "@/i18n/text"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { DateTime } from "luxon"

export async function FairDates() {
  const locale = await getLocale()
  const dates = await fetchDates()
  if (!dates) return null

  return (
    <div className="font-bebas-neue mt-5 flex gap-4">
      <p className="text-2xl text-stone-400 uppercase">
        <LocalizedText id="fair" />
      </p>
      <div className="flex">
        {[
          // Pick first and last day (ASSUMPTION: days are sorted and continuous)
          dates.fair.days[0],
          dates.fair.days[dates.fair.days.length - 1]
        ].map((date, index, list) => (
          <p key={date} className="text-2xl text-stone-400">
            {DateTime.fromISO(date, { zone: "Europe/Stockholm" })
              .setLocale(locale)
              .toFormat(
                // Only add month and year to last
                `d${index == list.length - 1 ? " MMM" : "-"}${DateTime.fromISO(date).year !== DateTime.now().year ? " YYYY" : ""}`
              )}
          </p>
        ))}
      </div>
    </div>
  )
}
