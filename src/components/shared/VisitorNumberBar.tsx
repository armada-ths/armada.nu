import { NumberCountUp } from "@/app/exhibitor/_components/NumberCountUp"

export function VisitorNumberBar({ disableAnimation = false }: { disableAnimation?: boolean }) {
  return (
    <div className="flex w-full flex-row flex-wrap justify-between gap-4 bg-melon-700 p-6 text-center md:text-2xl">
      <div className="w-3/12 font-bebas-neue font-medium text-stone-900">
        <NumberCountUp start={disableAnimation ? 20000 : 0} end={20000} duration={disableAnimation ? 0 : 1.2} isVisit />
        <p>visits</p>
      </div>
      <div className="w-3/12 font-bebas-neue font-medium text-stone-900">
        <NumberCountUp start={disableAnimation ? 15000 : 0} end={15000} duration={disableAnimation ? 0 : 1.2} />
        <p>Students</p>
      </div>
      <div className="w-3/12 font-bebas-neue font-medium text-stone-900">
        <NumberCountUp start={disableAnimation ? 2 : 0} end={2} duration={disableAnimation ? 0 : 1.2} isDays />
        <p>of networking</p>
      </div>
    </div>
  )
}
