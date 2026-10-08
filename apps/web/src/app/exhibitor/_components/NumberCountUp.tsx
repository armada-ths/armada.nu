"use client"
import CountUp from "react-countup"

export function NumberCountUp(props: {
  start: number
  end: number
  duration: number
  isVisit?: boolean
  isDays?: boolean
}) {
  return (
    <p className="place-content-end text-2xl md:text-4xl">
      <CountUp start={props.start} end={props.end} duration={props.duration} />
      {props.isVisit && "+"}
      {props.isDays && " Days"}
    </p>
  )
}
