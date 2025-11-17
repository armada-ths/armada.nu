"use client"

import BadgeCollection from "@/app/student/exhibitors/_components/BadgeCollection"
import ExhibitorDetails from "@/app/student/exhibitors/_components/ExhibitorDetails"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import Modal from "@/components/ui/Modal"

import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function ExhibitorCard({ exhibitor }: { exhibitor: Exhibitor }) {
  const searchParams = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)

  const { width } = useScreenSize()
  const maxDisplayedBadges = width && width < 470 ? 2 : 1

  useEffect(() => {
    const queryId = searchParams.get("id")
    if (queryId === exhibitor.id.toString()) setModalOpen(true)
    else setModalOpen(false)
  }, [exhibitor, searchParams])



  return (
    <>
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        className="max-w-[1000px] bg-linear-to-br from-emerald-950 via-stone-800 to-stone-900 p-0">
        <div className="p-4 sm:p-10">
          <ExhibitorDetails exhibitor={exhibitor} />

        </div>
      </Modal>

      <Link href={`/student/exhibitors?id=${exhibitor.id}`} scroll={false}>
        <div
          className={`
            ${exhibitor.tier === "Gold" ? "border-yellow-500 bg-yellow-500" : ""}
            ${exhibitor.tier === "Silver" ? "border-gray-400 bg-gray-400" : ""}
            ${exhibitor.tier === "Bronze" ? "border-emerald-900 bg-emerald-900" : ""}
            group flex h-full flex-col border-2 border-solid filter transition 
            hover:scale-[1.05] hover:brightness-95
            max-w-[90vw] sm:max-w-[380px] w-full px-3 rounded-lg
          `}
        >

          <h3
            className={`
              my-2 text-center font-bold font-bebas-neue text-2xl antialiased transition xs:text-xl

              ${exhibitor.tier === "Gold" ? "text-yellow-100 group-hover:text-yellow-300" : ""}
              ${exhibitor.tier === "Silver" ? "text-gray-200 group-hover:text-gray-100" : ""}
              ${exhibitor.tier === "Bronze" ? "text-emerald-200 group-hover:text-emerald-400" : ""}
            `}
          >
            {exhibitor.name}
          </h3>

          {(exhibitor.logoSquared || exhibitor.logoFreesize) ? (
            <div className="relative my-2 flex h-20 w-full flex-initial justify-center overflow-hidden">
              <Image
                className="h-full w-full object-contain"
                src={exhibitor.logoSquared ?? exhibitor.logoFreesize ?? ""}
                alt={exhibitor.name}
                width={300}
                height={300}
              />
            </div>
          ) : (
            <div className="relative mt-2 flex h-20 w-full flex-initial justify-center overflow-hidden" />
          )
          }
          <BadgeCollection
            items={exhibitor.industries ?? []}
            maxDisplayed={maxDisplayedBadges}
            className="mt-auto flex-nowrap justify-center overflow-hidden p-2.5 pt-0"
            badgeClassName="text-[0.65em] flex-initial truncate inline-block"
          />
        </div>
      </Link>
    </>
  )
}
