"use client"

import EventDetails from "@/app/student/events/_components/EventDetails"
import Modal from "@/components/shared/Modal"
import { Event } from "@/components/shared/hooks/api/useEvents"
import {
  cn,
  formatTimestampAsDate,
  formatTimestampAsTime,
  shouldBypassNextImageOptimization
} from "@/lib/utils"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function EventItem({ event }: { event: Event }) {
  const {
    id,
    name,
    eventStart: event_start,
    registrationEnd: registration_end,
    imageUrl: image_url
  } = event
  const shouldBypassImageOptimization =
    shouldBypassNextImageOptimization(image_url)

  const router = useRouter()
  const searchParams = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const queryId = searchParams.get("id")
    setModalOpen(queryId === id.toString())
  }, [id, searchParams])

  return (
    <>
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        onClose={() => router.push("/student/events", { scroll: false })}
        title={name}
        description={`Details and registration information for ${name}`}
        className="border-licorice bg-coconut shadow-shadow h-[80vh] w-[92vw] max-w-none overflow-hidden border-2 p-0 sm:max-w-6xl">
        <EventDetails
          event={event}
          className="h-full max-w-none p-6 md:p-10 lg:max-w-none"
        />
      </Modal>

      <Link
        href={`/student/events?id=${id}`}
        scroll={false}
        onClick={() => setModalOpen(true)}
        className={cn(
          "group rounded-base border-licorice bg-snow shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY focus-visible:outline-licorice flex w-full overflow-hidden border-2 transition-all hover:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4",
          image_url ? "flex-col sm:flex-row" : "flex-col"
        )}>
        {image_url && (
          <div className="border-licorice relative aspect-video w-full shrink-0 border-b-2 sm:aspect-auto sm:min-h-48 sm:w-52 sm:border-r-2 sm:border-b-0">
            <Image
              src={image_url}
              alt=""
              fill
              unoptimized={shouldBypassImageOptimization}
              className="object-cover object-center"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 p-5 text-left sm:p-6">
          <h2 className="font-bebas-neue text-licorice text-2xl leading-tight sm:text-3xl">
            {name}
          </h2>

          <div className="text-licorice/80 grid gap-2 text-sm sm:grid-cols-2">
            <p className="flex items-center gap-2 lg:hidden">
              <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
              {formatTimestampAsDate(event_start)}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              {formatTimestampAsTime(event_start)}
            </p>
            {event.location && (
              <p className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{event.location}</span>
              </p>
            )}
          </div>

          {registration_end && (
            <p className="rounded-base bg-coconut text-licorice w-fit px-2.5 py-1 text-xs font-bold">
              Registration closes {formatTimestampAsDate(registration_end)}
            </p>
          )}
        </div>
      </Link>
    </>
  )
}
