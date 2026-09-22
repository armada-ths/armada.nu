import { TimelineEntry } from "@/components/shared/hooks/api/useTimelineEntries"

type Era = {
  eraTitle: string
  entries: TimelineEntry[]
}

interface HistoryTimelineProps {
  eras: Era[]
}

function EntryDesktop({
  entry,
  side,
  isLast = false
}: {
  entry: TimelineEntry
  side: "left" | "right"
  isLast?: boolean
}) {
  const isLeft = side === "left"
  // Center dot
  const centerDot = (
    <div className="bg-melon border-licorice absolute top-2 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 shadow-[2px_2px_0_0_var(--color-licorice)]">
      <div className="bg-licorice h-2 w-2 rounded-full" />
    </div>
  )

  return (
    <div className="relative flex flex-row pb-4">
      {/* Center line */}
      <div
        className={`bg-licorice absolute left-1/2 w-0.5 -translate-x-1/2 ${isLast ? "top-0 h-[18px]" : "top-0 bottom-0"}`}
      />
      {!isLeft && <div className="w-1/2" />}
      {!isLeft && centerDot}
      <div className="relative w-1/2">
        {/* Connector */}
        <div
          className={`border-melon absolute top-[18px] w-full border-t-2 border-dashed ${isLeft ? "right-0" : "left-0"}`}
        />
        <div className={`relative mt-[25px] ${isLeft ? "mr-12" : "ml-12"}`}>
          {/* Title badge */}
          <div className="relative z-10 -mb-3 flex justify-center">
            <div
              role="heading"
              aria-level={3}
              className={`shadow-shadow border-licorice bg-melon font-bebas-neue text-licorice max-w-full rounded border-2 py-3 text-center text-3xl ${isLeft ? "px-10" : "px-5"}`}>
              {entry.title}
            </div>
          </div>
          {/* Info box */}
          <div className="border-licorice font-lato text-licorice rounded border-2 bg-white px-5 pt-6 pb-5 text-base">
            {entry.body}
          </div>
        </div>
      </div>
      {isLeft && centerDot}
      {isLeft && <div className="w-1/2" />}
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
  const lineClass = (() => {
    if (isFirst && isLast) return null
    if (isFirst) return "top-[26px] bottom-0"
    if (isLast) return "top-0 h-[26px]"
    return "top-0 bottom-0"
  })()

  return (
    <div className="relative pb-6 pl-8">
      {/* Vertical line */}
      {lineClass && (
        <div className={`bg-licorice absolute left-2 w-0.5 ${lineClass}`} />
      )}
      {/* Dot */}
      <div className="bg-melon border-licorice absolute top-4 left-0 z-10 flex h-5 w-5 -translate-x-[0.125rem] items-center justify-center rounded-full border-2 shadow-[2px_2px_0_0_var(--color-licorice)]">
        <div className="bg-licorice h-2 w-2 rounded-full" />
      </div>
      {/* Title badge */}
      <div
        role="heading"
        aria-level={3}
        className="shadow-shadow border-licorice bg-melon font-bebas-neue text-licorice mb-3 inline-block rounded border-2 px-4 py-2 text-2xl">
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
          {/* Era divider */}
          <div className="relative flex justify-center py-5 pl-2 md:py-0 md:pl-0">
            {eraIndex > 0 && (
              <div className="bg-licorice absolute inset-y-0 left-2 w-0.5 md:hidden" />
            )}
            <div className="flex w-full flex-col md:w-auto">
              <div className="border-licorice border-t-2" />
              <p
                role="heading"
                aria-level={2}
                className="font-bebas-neue text-licorice text-center text-3xl md:whitespace-nowrap">
                {era.eraTitle}
              </p>
              <div className="border-licorice border-t-2" />
            </div>
          </div>

          {/* Desktop timeline */}
          <div className="relative hidden pt-4 pb-6 md:block">
            <div className="bg-licorice absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2" />
            {eraIndex !== lastEraIndex && (
              <div className="bg-licorice absolute bottom-0 left-1/2 h-6 w-0.5 -translate-x-1/2" />
            )}
            {era.entries.map((entry, index) => {
              const isLastEntry =
                eraIndex === lastEraIndex && index === era.entries.length - 1
              return (
                <EntryDesktop
                  key={entry.id}
                  entry={entry}
                  side={index % 2 === 0 ? "left" : "right"}
                  isLast={isLastEntry}
                />
              )
            })}
          </div>

          {/* Mobile timeline */}
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
