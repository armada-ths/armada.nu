import { Page } from "@/components/shared/Page"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { Button } from "@/components/ui/button"
import { normalizeExternalUrl } from "@/lib/externalUrl"
import {
  cn,
  eventDateTimeToEpochSeconds,
  formatTimestampAsDate,
  formatTimestampAsTime,
  shouldBypassNextImageOptimization
} from "@/lib/utils"

import { Calendar, Clock, Coins, MapPin, User, Utensils } from "lucide-react"
import Image from "next/image"
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
    <div className="grid grid-cols-[1fr_1.4fr] gap-3 text-sm">
      <div className="text-licorice flex gap-2">
        <span className="mt-0.5 w-5 shrink-0">{icon}</span>
        <span className="font-bold">{label}</span>
      </div>
      <span className="text-licorice/75">{value}</span>
    </div>
  )
}

export default function EventDetails({
  event,
  className
}: {
  event: Event
  className?: string
}) {
  const shouldBypassImageOptimization = shouldBypassNextImageOptimization(
    event.imageUrl
  )
  const today = Math.floor(Date.now() / 1000)
  const eventStart = eventDateTimeToEpochSeconds(event.eventStart)
  const registrationClose = eventDateTimeToEpochSeconds(event.registrationEnd)
  const registrationCutoff = registrationClose ?? eventStart ?? today
  const signupUrl = normalizeExternalUrl(event.signupLink)
  return (
    <div
      className={cn(
        "mx-auto flex max-w-150 flex-col gap-6 lg:grid lg:max-w-250 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-0",
        className
      )}>
      <Page.Header className="text-licorice lg:col-start-1 lg:row-start-1 lg:pb-6">
        {event.name}
      </Page.Header>

      <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-2 lg:overflow-y-auto lg:pr-2">
        {event.imageUrl && (
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              unoptimized={shouldBypassImageOptimization}
              className="object-cover object-center"
            />
          </div>
        )}

        <div
          className="prose text-licorice/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </div>

      <aside className="rounded-base border-licorice bg-snow shadow-shadow flex h-fit flex-col gap-4 border-2 p-5 lg:col-start-2 lg:row-start-2 lg:max-h-full lg:overflow-y-auto">
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
        <div className="bg-licorice/20 h-0.5 w-full" />
        {/* Bottom row */}
        {event.eventMaxCapacity > 0 && (
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
          value={event.fee}
          icon={<Coins size={16} />}></InfoBoxItem>
        {event.openForSignupStudent && registrationClose && (
          <p className="text-licorice/65 mt-3 -mb-1 text-xs">
            Registration closes {formatTimestampAsDate(event.registrationEnd)}
          </p>
        )}
        {/* Signup */}
        {event.registrationRequired ? (
          signupUrl ? (
            <Button asChild className="w-full">
              <TrackedLink
                href={signupUrl}
                target="_blank"
                rel="noreferrer"
                tracking={{
                  eventName: "student_event_signup_click",
                  eventData: { event_name: event.name }
                }}>
                Sign up
              </TrackedLink>
            </Button>
          ) : (
            <Button disabled>
              {today < registrationCutoff
                ? "Signup coming soon!"
                : "Registration closed"}
            </Button>
          )
        ) : (
          <p className="text-licorice/65 mt-2 text-center text-sm">
            No registration required
          </p>
        )}
      </aside>
    </div>
  )
}
