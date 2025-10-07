"use client"

import { DateTime } from "luxon"
import { useEffect, useState } from "react"

export function FairCountdown({ timeData }) {
  const fr_end_data = "2025-11-19T17:00:00+01:00"
  const fr_start_data = "2025-09-18T12:00:00+01:00"

  const [timeLeft, setTimeLeft] = useState(
    DateTime.fromISO(timeData).diff(DateTime.now(), [
      "days",
      "hours",
      "minutes",
      "seconds"
    ])
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(
        DateTime.fromISO(timeData).diff(DateTime.now(), [
          "days",
          "hours",
          "minutes",
          "seconds"
        ])
      )

      if (timeLeft.toMillis() <= 0) {
        setTimeLeft(DateTime.now().diff(DateTime.now()))
        clearInterval(interval)
        return
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <p className="p-2 text-3xl font-bold">FAIR STARTS IN</p>
      <div className="flex">
        <p className="flex-1">
          {timeLeft.days}
          <br />
          Days
        </p>
        <p className="flex-1">
          {timeLeft.hours}
          <br />
          Hours
        </p>
        <p className="flex-1">
          {timeLeft.minutes}
          <br />
          minutes
        </p>
        <p className="flex-1">
          {Math.floor(timeLeft.seconds)}
          <br />
          Seconds
        </p>
      </div>
    </div>
  )
}
