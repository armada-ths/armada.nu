"use client"

import { useDates } from "@/components/shared/hooks/api/useDates"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"

export function Countdown() {
  const { data, isLoading } = useDates()

  const fairDate = DateTime.fromObject({
    year: 2024,
    month: 5,
    day: 12,
    hour: 10
  })
  const [duration, setDuration] = useState(
    fairDate.diffNow(["days", "hour", "minutes", "seconds"])
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(fairDate.diffNow(["days", "hour", "minutes", "seconds"]))
    }, 1000)

    return () => clearInterval(interval)
  }, [fairDate])

  const startDate = data?.fair.days[0]
  const endDate = data?.fair.days[data.fair.days.length - 1]
  if (isLoading || !data || startDate == null || endDate == null) return null

  return (
    <>
      <p
        role="heading"
        aria-level={2}
        aria-label="fair-date"
        className="font-bebas-neue text-melon-700 text-3xl">
        {DateTime.fromISO(startDate).toFormat("d")}-
        {DateTime.fromISO(endDate).toFormat(
          `d MMM${DateTime.fromISO(endDate).year !== DateTime.now().year ? " yyyy" : ""}`
        )}
      </p>
      <div className="text-licorice-700 font-bebas-neue flex gap-x-4 text-lg opacity-70 md:text-xl">
        <div>
          <h3>Days</h3>
          <p>{duration.days}</p>
        </div>
        <div>
          <h3>Hours</h3>
          <p>{duration.hours}</p>
        </div>
        <div>
          <h3>Minutes</h3>
          <p>{duration.minutes}</p>
        </div>
        <div>
          <h3>Seconds</h3>
          <p>{Math.floor(duration.seconds)}</p>
        </div>
      </div>
    </>
  )
}
