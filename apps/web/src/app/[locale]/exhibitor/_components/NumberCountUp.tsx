"use client"
import { useFormatter } from "next-intl"
import CountUp from "react-countup"

export function NumberCountUp(props: {
  start: number
  end: number
  duration: number
  isVisit?: boolean
  isDays?: boolean
}) {
  const format = useFormatter()
  return (
    <p className="place-content-end text-2xl md:text-4xl">
      <CountUp
        start={props.start}
        end={props.end}
        duration={props.duration}
        formattingFn={value =>
          format.number(value, { maximumFractionDigits: 0 })
        }
      />
      {props.isVisit && "+"}
    </p>
  )
}
