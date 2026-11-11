"use client"
import { useFormatter, useTranslations } from "next-intl"
import CountUp from "react-countup"

export function NumberCountUp(props: {
  start: number
  end: number
  duration: number
  showPlus?: boolean
  isDays?: boolean
}) {
  const format = useFormatter()
  const t = useTranslations("Static")
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
      {props.showPlus && "+"}
      {props.isDays && ` ${t("days")}`}
    </p>
  )
}
