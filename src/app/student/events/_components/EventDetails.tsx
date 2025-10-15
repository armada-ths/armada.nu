import { Page } from "@/components/shared/Page"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { Button } from "@/components/ui/button"
import {
  cn,
  eventDateTimeToEpochSeconds,
  formatTimestampAsDate,
  formatTimestampAsTime
} from "@/lib/utils"

import { Calendar, Clock, Coins, MapPin, User, Utensils } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

function InfoBoxItem({
  label,
  value,
  icon
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  if (value == null) return
  return (
    <div className="flex gap-8">
      <div className="flex gap-2 text-stone-200">
        <span className="mt-1 w-5">{icon}</span>
        <span className="w-20 flex-none font-bold">{label}:</span>
      </div>
      <span className="text-stone-400">{value}</span>
    </div>
  )
}

function cleanHtmlDescription(html: string): string {
  return html
    .replace(/ style="[^"]*"/g, "") // remove inline styles
    .replace(/ class="[^"]*"/g, "") // remove editor classes
    .replace(/<i><em>/g, "<em>")    // flatten double italic
    .replace(/<\/em><\/i>/g, "</em>");
}

export default function EventDetails({
  event,
  className
}: {
  event: Event
  className?: string
}) {
  const today = Math.floor(Date.now() / 1000)
  const eventStart = eventDateTimeToEpochSeconds(event.eventStart)
  const registrationClose = eventDateTimeToEpochSeconds(event.registrationEnd)
  const registrationCutoff = registrationClose ?? eventStart ?? today
  return (
    <div className={cn("mx-auto max-w-[600px] lg:max-w-[1000px]", className)}>
      <Page.Header>{event.name}</Page.Header>
      <div className="flex flex-col lg:flex-row lg:items-center gap-10">
        {/* Left: Image + Description */}
        <div className="flex-1 space-y-6">
          {event.imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover object-center"
              />
            </div>
          )}

          <div
            className="prose prose-invert text-stone-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanHtmlDescription(event.description) }}
          />
        </div>

        <div className="mt-1 flex h-fit flex-col gap-4 rounded-md border border-emerald-900 bg-gradient-to-br from-emerald-950 to-neutral-900 to-50% p-5 lg:w-2/5">
          {/* Top row */}
          <InfoBoxItem
            label="Location"
            value={event.location}
            icon={<MapPin size={16} />}></InfoBoxItem>
          <InfoBoxItem
            label="Date"
            value={formatTimestampAsDate(event.eventStart)}
            icon={<Calendar size={16} />}></InfoBoxItem>
          <InfoBoxItem
            label="Time"
            value={`${formatTimestampAsTime(event.eventStart)} - ${formatTimestampAsTime(event.eventEnd)}`}
            icon={<Clock size={16} />}></InfoBoxItem>
          {/* Separator */}
          {(event.food || event.fee || event.eventMaxCapacity) && (
            <div className="h-[1px] w-full bg-stone-400"></div>
          )}
          {/* Bottom row */}
          {event.eventMaxCapacity && (
            <InfoBoxItem
              label="Capacity"
              value={`${event.eventMaxCapacity} participants`}
              icon={<User size={16} />}></InfoBoxItem>
          )}
          <InfoBoxItem
            label="Food"
            value={event.food}
            icon={<Utensils size={16} />}></InfoBoxItem>
          <InfoBoxItem
            label="Fee"
            value={`${event.fee ?? 'TBA'} kr`}
            icon={<Coins size={16} />}></InfoBoxItem>
          {event.openForSignupStudent && registrationClose && (
            <p className="-mb-1 mt-3 text-xs text-stone-400">
              Registration closes {formatTimestampAsDate(event.registrationEnd)}
            </p>
          )}
          {/* Signup */}
          {event.openForSignupStudent && today < registrationCutoff ? (
            <Link href={event.signupLink ?? ""}>
              <Button className="w-full">
                {event.eventMaxCapacity == null ||
                  event.participantCount < event.eventMaxCapacity
                  ? "Signup"
                  : "Join waiting List"}
              </Button>
            </Link>
          ) : (
            <Button disabled>
              {today < registrationCutoff ? (
                <> Signup opening soon! </>
              ) : (
                <>
                  Registration closed{" "}
                  {registrationClose
                    ? formatTimestampAsDate(event.registrationEnd)
                    : ""}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
