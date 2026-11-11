import { NumberCountUp } from "@/app/[locale]/exhibitor/_components/NumberCountUp"

export function VisitorNumberBar({
  disableAnimation = false,
  labels
}: {
  disableAnimation?: boolean
  labels: {
    visits: string
    exhibitors: string
    networking: string
  }
}) {
  const visitCount = 20000
  const exhibitorCount = 80
  const networkingDays = 2
  const animationDuration = disableAnimation ? 0 : 1.2

  return (
    <div className="bg-melon border-licorice w-full border-y-2 border-solid p-6">
      <div className="mx-auto flex max-w-4xl flex-row justify-between text-center md:text-2xl">
        <div className="font-bebas-neue w-3/12 font-medium text-stone-900">
          <NumberCountUp
            start={disableAnimation ? visitCount : 0}
            end={visitCount}
            duration={animationDuration}
            showPlus
          />
          <p>{labels.visits}</p>
        </div>
        <div className="font-bebas-neue w-3/12 font-medium text-stone-900">
          <NumberCountUp
            start={disableAnimation ? exhibitorCount : 0}
            end={exhibitorCount}
            duration={animationDuration}
            showPlus
          />
          <p>{labels.exhibitors}</p>
        </div>
        <div className="font-bebas-neue w-3/12 font-medium text-stone-900">
          <NumberCountUp
            start={disableAnimation ? networkingDays : 0}
            end={networkingDays}
            duration={animationDuration}
            isDays
          />
          <p>{labels.networking}</p>
        </div>
      </div>
    </div>
  )
}
