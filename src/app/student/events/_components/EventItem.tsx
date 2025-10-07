"use client"

import EventDetails from "@/app/student/events/_components/EventDetails"
import Modal from "@/components/shared/Modal"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { formatTimestampAsDate } from "@/lib/utils"
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
          router.push("/student/events", { scroll: false }) // clear url when the modal is closed
        }}
        className="max-w-[1000px] bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 p-0">
        <EventDetails event={event} className="p-6 md:p-10" />
      </Modal>

      <div className="absolute -start-1.5 mt-3.5 h-3 w-3 rounded-full border border-white bg-melon-700"></div>
      <div className="mb-6 ml-6 w-11/12 rounded-lg border-2 border-solid border-emerald-900 bg-gradient-to-br from-emerald-950 to-liqorice-700 transition hover:scale-[1.02] hover:brightness-95 sm:w-3/5 sm:min-w-[500px]">
        <Link
          href={`/student/events?id=${id}`}
          scroll={false}
          className="flex flex-auto flex-col sm:h-48 sm:flex-row sm:items-center">
          {image_url && (
            <Image
              width={200}
              height={200}
              className="h-full max-h-48 w-full rounded-t-lg object-contain sm:h-48 sm:w-48 sm:rounded-l-lg sm:rounded-tr-none"
              src={image_url}
              alt=""
            />
          )}
          <div className="flex flex-col justify-between pl-5">
            <h5 className="mb-2 mt-5 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {name}
            </h5>
            <p className="mb-3 text-gray-700 dark:text-neutral-400">
              {formatTimestampAsDate(event_start)}
            </p>
            {registration_end && (
              <p className="mb-4 text-xs text-gray-700 dark:text-neutral-400">
                Registration closes {formatTimestampAsDate(registration_end)}
              </p>
            )}
          </div>
        </Link>
      </div>
    </>
  )
}
