import { NumberCountUp } from "@/app/exhibitor/_components/NumberCountUp"

export function VisitorNumberBar({
  disableAnimation = false,
  labels = {
    visits: "visits",
    students: "Students",
    networking: "of networking"
  }
}: {
  disableAnimation?: boolean
  labels?: {
    visits: string
    students: string
    networking: string
  }
}) {
  return (
    <div className="bg-melon border-licorice w-full border-y-2 p-6">
      <div className="mx-auto flex max-w-4xl flex-row justify-between text-center md:text-2xl">
        <div className="font-bebas-neue w-3/12 font-medium text-stone-900">
          <NumberCountUp
            start={disableAnimation ? 20000 : 0}
            end={20000}
            duration={disableAnimation ? 0 : 1.2}
            isVisit
          />
          <p>{labels.visits}</p>
        </div>
        <div className="font-bebas-neue w-3/12 font-medium text-stone-900">
          <NumberCountUp
            start={disableAnimation ? 15000 : 0}
            end={15000}
            duration={disableAnimation ? 0 : 1.2}
          />
          <p>{labels.students}</p>
        </div>
        <div className="font-bebas-neue w-3/12 font-medium text-stone-900">
          <NumberCountUp
            start={disableAnimation ? 2 : 0}
            end={2}
            duration={disableAnimation ? 0 : 1.2}
            isDays
          />
          <p>{labels.networking}</p>
        </div>
      </div>
    </div>
  )
}
