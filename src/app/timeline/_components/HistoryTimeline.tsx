import { TimelineEntry } from "@/components/shared/hooks/api/useTimelineEntries"

type Era = {
  eraTitle: string
  entries: TimelineEntry[]
}

interface HistoryTimelineProps {
  eras: Era[]
}

function EntryLeft({
  entry,
  isLast = false
}: {
  entry: TimelineEntry
  isLast?: boolean
}) {
  return (
    <div className="relative flex flex-row pb-4">
      {/* Center line segment: stops at dot center (18 px) for the last entry */}
      <div
        className={`bg-licorice absolute left-1/2 w-0.5 -translate-x-1/2 ${isLast ? "top-0 h-[18px]" : "top-0 bottom-0"}`}
      />
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
        <div className="bg-licorice h-2 w-2 rounded-full" />
      </div>
      {/* Right half: empty */}
      <div className="w-1/2" />
    </div>
  )
}

function EntryRight({
  entry,
  isLast = false
}: {
  entry: TimelineEntry
  isLast?: boolean
}) {
  return (
    <div className="relative flex flex-row pb-4">
      {/* Center line segment: stops at dot center (18 px) for the last entry */}
      <div
        className={`bg-licorice absolute left-1/2 w-0.5 -translate-x-1/2 ${isLast ? "top-0 h-[18px]" : "top-0 bottom-0"}`}
      />
      {/* Left half: empty */}
      <div className="w-1/2" />
      {/* Center dot: top-2 places it slightly above the title badge; connected at its vertical center (8px + 10px = 18px) */}
      <div className="bg-melon border-licorice absolute top-2 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 shadow-[2px_2px_0_0_var(--color-licorice)]">
        <div className="bg-licorice h-2 w-2 rounded-full" />
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

function EntryMobile({
  entry,
  isFirst = false,
  isLast = false
}: {
  entry: TimelineEntry
  isFirst?: boolean
  isLast?: boolean
}) {
  // Dot center is at top-4 (16px) + h-5/2 (10px) = 26px from entry top.
  // Trim the line so it starts/stops exactly at the dot center for the
  // first and last entries, matching the exhibitor timeline behaviour.
  const lineClass = (() => {
    if (isFirst && isLast) return null // single entry — no line needed
    if (isFirst) return "top-[26px] bottom-0"
    if (isLast) return "top-0 h-[26px]"
    return "top-0 bottom-0"
  })()

  return (
    <div className="relative pb-6 pl-8">
      {/* Vertical line: trimmed at dot center for first/last entries */}
      {lineClass && (
        <div className={`bg-licorice absolute left-2 w-0.5 ${lineClass}`} />
      )}
      {/* Dot */}
      <div className="bg-melon border-licorice absolute top-4 left-0 z-10 flex h-5 w-5 -translate-x-[0.125rem] items-center justify-center rounded-full border-2 shadow-[2px_2px_0_0_var(--color-licorice)]">
        <div className="bg-licorice h-2 w-2 rounded-full" />
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
  const lastEraIndex = eras.length - 1
  return (
    <div className="mt-10 px-4 md:px-16">
      {eras.map((era, eraIndex) => (
        <div key={era.eraTitle}>
          {/* Era divider: py-10 (not my-10) on mobile so the connecting line
              can be absolutely positioned through the full padded height.
              On desktop spacing lives inside the block below so py is 0. */}
          <div className="relative flex justify-center py-10 md:py-0">
            {/* Vertical connecting line through the era divider gap (mobile only,
                only between eras — not above the very first era) */}
            {eraIndex > 0 && (
              <div className="bg-licorice absolute inset-y-0 left-2 w-0.5 md:hidden" />
            )}
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
            {/* Restore the line through the pt-4 top gap (16 px) so it connects
                seamlessly with whatever is above the container. */}
            <div className="bg-licorice absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2" />
            {/* Restore the line through the pb-6 bottom gap (24 px) for every
                era except the last, so it connects down to the next era divider. */}
            {eraIndex !== lastEraIndex && (
              <div className="bg-licorice absolute bottom-0 left-1/2 h-6 w-0.5 -translate-x-1/2" />
            )}
            {/* Line is rendered per-entry so the last entry's segment can stop
                exactly at the dot centre (18 px from entry top). */}
            {era.entries.map((entry, index) => {
              const isLastEntry =
                eraIndex === lastEraIndex && index === era.entries.length - 1
              return index % 2 === 0 ? (
                <EntryLeft key={entry.id} entry={entry} isLast={isLastEntry} />
              ) : (
                <EntryRight key={entry.id} entry={entry} isLast={isLastEntry} />
              )
            })}
          </div>

          {/* Mobile layout */}
          <div className="relative block md:hidden">
            {era.entries.map((entry, index) => (
              <EntryMobile
                key={entry.id}
                entry={entry}
                isFirst={eraIndex === 0 && index === 0}
                isLast={
                  eraIndex === lastEraIndex && index === era.entries.length - 1
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
