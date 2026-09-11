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
    <div className="relative flex flex-row pb-4">
      {/* Left half */}
      <div className="relative w-1/2">
        {/* Dashed connector: melon, spans full width from center line (right-0) to the far left edge of the info box */}
        <div className="border-melon absolute top-[18px] right-0 w-full border-t-2 border-dashed" />
        {/* Entry wrapper: mr-12 creates the gap from center, mt-[69px] shifts the badge below the dot */}
        <div className="relative mt-[69px] mr-12">
          {/* Title badge: centered horizontally, overhanging above the info box */}
          <div className="absolute -top-11 left-1/2 z-10 w-fit -translate-x-1/2">
            <div className="shadow-shadow border-licorice bg-melon font-bebas-neue text-licorice rounded border-2 px-10 py-3 text-center text-3xl whitespace-nowrap">
              {entry.title}
            </div>
          </div>
          {/* Information box */}
          <div className="border-licorice font-lato text-licorice rounded border-2 bg-white px-5 pt-11 pb-5 text-base">
            {entry.body}
          </div>
        </div>
      </div>
      {/* Center dot: top-2 places it slightly above the title badge; connected at its vertical center (8px + 10px = 18px) */}
      <div className="bg-melon border-licorice absolute top-2 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 shadow-[2px_2px_0_0_var(--color-licorice)]">
        <div className="bg-licorice h-2.5 w-2.5 rounded-full" />
      </div>
      {/* Right half: empty */}
      <div className="w-1/2" />
    </div>
  )
}

function EntryRight({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative flex flex-row pb-4">
      {/* Left half: empty */}
      <div className="w-1/2" />
      {/* Center dot: top-2 places it slightly above the title badge; connected at its vertical center (8px + 10px = 18px) */}
      <div className="bg-melon border-licorice absolute top-2 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 shadow-[2px_2px_0_0_var(--color-licorice)]">
        <div className="bg-licorice h-2.5 w-2.5 rounded-full" />
      </div>
      {/* Right half */}
      <div className="relative w-1/2">
        {/* Dashed connector: melon, spans full width from center line (left-0) to the far right edge of the info box */}
        <div className="border-melon absolute top-[18px] left-0 w-full border-t-2 border-dashed" />
        {/* Entry wrapper: ml-12 creates the gap from center, mt-[69px] shifts the badge below the dot */}
        <div className="relative mt-[69px] ml-12">
          {/* Title badge: centered horizontally, overhanging above the info box */}
          <div className="absolute -top-11 left-1/2 z-10 w-fit -translate-x-1/2">
            <div className="shadow-shadow border-licorice bg-melon font-bebas-neue text-licorice rounded border-2 px-5 py-3 text-center text-3xl whitespace-nowrap">
              {entry.title}
            </div>
          </div>
          {/* Information box */}
          <div className="border-licorice font-lato text-licorice rounded border-2 bg-white px-5 pt-11 pb-5 text-base">
            {entry.body}
          </div>
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
      <div className="bg-melon border-licorice absolute top-4 left-0 z-10 flex h-5 w-5 -translate-x-[0.125rem] items-center justify-center rounded-full border-2 shadow-[2px_2px_0_0_var(--color-licorice)]">
        <div className="bg-licorice h-2.5 w-2.5 rounded-full" />
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
    <div className="mt-10 px-4 md:px-16">
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
          <div className="relative hidden pt-4 pb-6 md:block">
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
