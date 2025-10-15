"use client"

import EventDetails from "@/app/student/events/_components/EventDetails"
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
    if (queryId === id.toString()) setModalOpen(true)
    else setModalOpen(false)
  }, [id, searchParams])

  return (
    <>
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        onClose={() => {
          router.push("/student/events", { scroll: false })
        }}
        className="max-w-[1000px] bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 p-0"
      >
        <EventDetails event={event} className="p-6 md:p-10" />
      </Modal>

      <div className="absolute -start-1.5 mt-3.5 h-3 w-3 rounded-full border border-white bg-melon-700"></div>
      <div className="mb-6 ml-6 w-11/12 overflow-hidden rounded-lg border-2 border-solid border-emerald-900 bg-gradient-to-br from-emerald-950 to-liqorice-700 transition hover:scale-[1.02] hover:brightness-95 sm:w-3/5 sm:min-w-[500px]">
        <Link
          href={`/student/events?id=${id}`}
          scroll={false}
          className={cn(
            "group grid min-h-[12rem] w-full overflow-hidden transition hover:scale-[1.02] hover:brightness-95",
            image_url
              ? "grid-cols-[auto_1fr]" // With image
              : "place-items-center" // No image → fully centered
          )}
        >
          {/* Image (optional) */}
          {image_url && (
            <Image
              src={image_url}
              alt=""
              width={192}
              height={192}
              className="h-full w-48 object-cover"
            />
          )}

          {/* Text content */}
          <div
            className={cn(
              "flex flex-col gap-1 px-6 py-8 transition-transform duration-200",
              image_url
                ? "justify-center items-start text-left"
                : "items-center justify-center text-center"
            )}
          >
            <h5 className="text-2xl font-semibold text-white">{name}</h5>
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
