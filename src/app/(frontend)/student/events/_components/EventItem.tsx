"use client"

import EventDetails from "@/app/(frontend)/student/events/_components/EventDetails"
import Modal from "@/components/shared/Modal"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { cn, formatTimestampAsDate } from "@/lib/utils"
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
        className="max-w-[1000px] overflow-y-auto bg-linear-to-br from-emerald-950 via-stone-800 to-stone-900 p-0">
        <EventDetails event={event} className="p-6 md:p-10" />
      </Modal>

      {/* Card container */}
      <div className="mb-6 w-full sm:ml-6 sm:w-3/5 sm:min-w-[500px]">
        <Link
          href={`/student/events?id=${id}`}
          scroll={false}
          className={cn(
            "group to-liqorice-700 flex overflow-hidden rounded-lg border-2 border-emerald-900 bg-linear-to-br from-emerald-950 via-80% transition hover:scale-[1.02] hover:brightness-95",
            image_url ? "flex-col sm:flex-row" : "flex-col"
          )}>
          {/* Image section */}
          {image_url && (
            <div className="relative h-32 w-full shrink-0 sm:h-auto sm:min-h-44 sm:w-48">
              <Image
                src={image_url}
                alt={name}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent sm:hidden" />
            </div>
          )}

          {/* Text section */}
          <div
            className={cn(
              "flex flex-1 flex-col justify-center gap-1 p-5 text-center sm:text-left",
              !image_url && "items-center py-8 text-center"
            )}>
            <h5 className="text-xl font-semibold text-white sm:text-2xl">
              {name}
            </h5>
            <p className="text-sm text-stone-300">
              {formatTimestampAsDate(event_start)}
            </p>
            {registration_end && (
              <p className="text-xs text-stone-500">
                Registration closes {formatTimestampAsDate(registration_end)}
              </p>
            )}
          </div>
        </Link>
      </div>
    </>
  )
}
