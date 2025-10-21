"use client"

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const isOver =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0

  return (
    <div className="w-full flex-1 rounded pb-2 text-2xl font-medium text-center">
      {isOver ? (
        <p className="p-2 text-3xl font-bold text-melon-700 animate-pulse">
          The Armada Fair is Live!
        </p>
      ) : (
        <>
          <p className="p-2 text-3xl font-bold">FAIR STARTS IN</p>
          <div className="flex justify-center">
            <TimeBox value={timeLeft.days} label="Days" />
            <TimeBox value={timeLeft.hours} label="Hours" />
            <TimeBox value={timeLeft.minutes} label="Minutes" />
            <TimeBox value={timeLeft.seconds} label="Seconds" />
          </div>
        </>
      )}
    </div>
  )
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <p className="flex-1">
      {value}
      <br />
      {label}
    </p>
  )
}

function getTimeLeft(targetDate: Date) {
  const now = new Date().getTime()
  const distance = targetDate.getTime() - now

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((distance / (1000 * 60)) % 60)
  const seconds = Math.floor((distance / 1000) % 60)

  return { days, hours, minutes, seconds }
}
