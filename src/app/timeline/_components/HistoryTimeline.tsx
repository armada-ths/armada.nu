import { TimelineEntry } from "@/components/shared/hooks/api/useTimelineEntries"

type Era = {
  eraTitle: string
  entries: TimelineEntry[]
}

interface HistoryTimelineProps {
  eras: Era[]
}

function EntryLeft({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative flex flex-row pb-8">
      {/* Left half: content */}
      <div className="relative w-1/2 pr-8">
        {/* Title badge */}
        <div className="absolute top-0 right-8 z-10 translate-x-0">
          <div className="shadow-shadow border-licorice bg-melon font-bebas-neue text-licorice rounded border-2 px-4 py-3 text-3xl">
            {entry.title}
          </div>
        </div>
        {/* Dashed connector */}
        <div className="border-licorice absolute top-[1.875rem] right-0 w-8 border-t-2 border-dashed" />
        {/* Body card */}
        <div className="border-licorice font-lato text-licorice mt-14 rounded border-2 bg-white px-4 pt-4 pb-4 text-base">
          {entry.body}
        </div>
      </div>
      {/* Center dot */}
      <div className="bg-melon border-licorice absolute top-4 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2">
        <div className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
      {/* Right half: empty */}
      <div className="w-1/2" />
    </div>
  )
}

function EntryRight({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative flex flex-row pb-8">
      {/* Left half: empty */}
      <div className="w-1/2" />
      {/* Center dot */}
      <div className="bg-melon border-licorice absolute top-4 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2">
        <div className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
      {/* Right half: content */}
      <div className="relative w-1/2 pl-8">
        {/* Title badge */}
        <div className="absolute top-0 left-8 z-10">
          <div className="shadow-shadow border-licorice bg-melon font-bebas-neue text-licorice rounded border-2 px-4 py-3 text-3xl">
            {entry.title}
          </div>
        </div>
        {/* Dashed connector */}
        <div className="border-licorice absolute top-[1.875rem] left-0 w-8 border-t-2 border-dashed" />
        {/* Body card */}
        <div className="border-licorice font-lato text-licorice mt-14 rounded border-2 bg-white px-4 pt-4 pb-4 text-base">
          {entry.body}
        </div>
      </div>
    </div>
  )
}

function EntryMobile({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative pb-6 pl-8">
      {/* Left vertical line segment indicator */}
      <div className="bg-licorice absolute top-0 bottom-0 left-2 w-0.5" />
      {/* Dot */}
      <div className="bg-melon border-licorice absolute top-4 left-0 z-10 flex h-5 w-5 -translate-x-[0.125rem] items-center justify-center rounded-full border-2">
        <div className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
      {/* Title badge */}
      <div className="shadow-shadow border-licorice bg-melon font-bebas-neue text-licorice mb-3 inline-block rounded border-2 px-4 py-2 text-2xl">
        {entry.title}
      </div>
      {/* Body card */}
      <div className="border-licorice font-lato text-licorice rounded border-2 bg-white px-4 py-3 text-base">
        {entry.body}
      </div>
    </div>
  )
}

export function HistoryTimeline({ eras }: HistoryTimelineProps) {
  return (
    <div className="mt-10">
      {eras.map(era => (
        <div key={era.eraTitle}>
          {/* Era divider: keep mobile margin; on desktop the spacing lives inside the block below */}
          <div className="my-10 flex justify-center md:my-0">
            <div className="flex flex-col">
              <div className="border-licorice border-t-2" />
              <p className="font-bebas-neue text-licorice text-3xl whitespace-nowrap">
                {era.eraTitle}
              </p>
              <div className="border-licorice border-t-2" />
            </div>
          </div>

          {/* Desktop layout */}
          <div className="relative hidden pt-10 pb-10 md:block">
            {/* Center vertical line */}
            <div className="bg-licorice absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2" />
            {era.entries.map((entry, index) =>
              index % 2 === 0 ? (
                <EntryLeft key={entry.id} entry={entry} />
              ) : (
                <EntryRight key={entry.id} entry={entry} />
              )
            )}
          </div>

          {/* Mobile layout */}
          <div className="relative block md:hidden">
            {era.entries.map(entry => (
              <EntryMobile key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
