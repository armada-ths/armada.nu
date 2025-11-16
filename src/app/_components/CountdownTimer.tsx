"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

const FINAL_COUNTDOWN_START_SECONDS = 30
const FINAL_COUNTDOWN_DURATION = 1750

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const initialLeft = getTimeLeft(targetDate)
  const [timeLeft, setTimeLeft] = useState(initialLeft)
  const initialIsOver =
    initialLeft.days === 0 &&
    initialLeft.hours === 0 &&
    initialLeft.minutes === 0 &&
    initialLeft.seconds === 0

  const [animationStage, setAnimationStage] = useState<'counting' | 'final-countdown' | 'celebration'>(
    initialIsOver ? 'final-countdown' : 'counting'
  )
  const [finalCountdown, setFinalCountdown] = useState(FINAL_COUNTDOWN_START_SECONDS)

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

  useEffect(() => {
    if (isOver && animationStage === 'counting') {
      setAnimationStage('final-countdown')
    }
  }, [isOver, animationStage])

  useEffect(() => {
    if (animationStage === 'final-countdown') {
      const startSeconds = FINAL_COUNTDOWN_START_SECONDS
      const totalDurationMs = FINAL_COUNTDOWN_DURATION
      const startTime = Date.now()
      setFinalCountdown(startSeconds)

      const countdownInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed >= totalDurationMs) {
          setFinalCountdown(0)
          clearInterval(countdownInterval)
          setAnimationStage('celebration')
          return
        }

        const progress = elapsed / totalDurationMs
        const remaining = Math.max(0, startSeconds - Math.floor(progress * startSeconds))
        setFinalCountdown(remaining)
      }, 30)

      return () => clearInterval(countdownInterval)
    }
  }, [animationStage])

  return (
    <div className="w-full flex-1 rounded-sm pb-2 text-2xl font-medium text-center overflow-visible relative">
      {animationStage === 'celebration' && <ConfettiBurst />}
      {animationStage === 'final-countdown' ? (
        <FinalCountdown count={finalCountdown} />
      ) : animationStage === 'celebration' ? (
        <Celebration />
      ) : isOver ? (
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

function FinalCountdown({ count }: { count: number }) {
  const minutes = Math.floor(count / 60)
  const seconds = count % 60
  return (
    <>
      <p className="p-2 text-3xl font-bold">FAIR STARTS IN</p>
      <div key={count} className="flex justify-center">
        <TimeBox value={0} label="Days" />
        <TimeBox value={0} label="Hours" />
        <TimeBox value={minutes} label="Minutes" />
        <TimeBox value={seconds} label="Seconds" />
      </div>
    </>
  )
}

function Celebration() {
  return (
    <div className="relative animate-[scale_1.5s_ease-in-out_1,subtlePulse_2s_ease-in-out_1.5s_infinite]">
      <div className="relative z-10">
        <p className="p-2 text-3xl font-bold">
          THE FAIR IS LIVE!
        </p>
        <div className="flex justify-center">
          <TimeBox value={0} label="Days" />
          <TimeBox value={0} label="Hours" />
          <TimeBox value={0} label="Minutes" />
          <TimeBox value={0} label="Seconds" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.07);
          }
        }
        @keyframes subtlePulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  )
}

const CONFETTI_COLORS = ['#00d790', '#00d790', '#e73953', '#2d2d2c', '#00d790', '#6b7280', '#e73953', '#00d790']
const CONFETTI_COUNT = 30

function ConfettiBurst() {

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] h-[300px] pointer-events-none z-9999 overflow-visible">
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const angle = (i / CONFETTI_COUNT) * 360
        const horizontalDistance = 240 + Math.random() * 60
        const verticalDistance = 100 + Math.random() * 40
        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
        const size = 4 + Math.random() * 4
        const duration = 0.8 + Math.random() * 0.4

        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              animation: `confettiBurst ${duration}s ease-out forwards`,
              '--angle': `${angle}deg`,
              '--h-distance': `${horizontalDistance}px`,
              '--v-distance': `${verticalDistance}px`,
            } as React.CSSProperties & { '--angle': string; '--h-distance': string; '--v-distance': string }}
          />
        )
      })}
      <style>{`
        @keyframes confettiBurst {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + var(--h-distance) * cos(var(--angle))),
              calc(-50% + var(--v-distance) * sin(var(--angle)))
            ) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
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
