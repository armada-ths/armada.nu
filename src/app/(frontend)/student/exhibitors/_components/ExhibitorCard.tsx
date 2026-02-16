"use client"

import BadgeCollection from "@/app/(frontend)/student/exhibitors/_components/BadgeCollection"
import ExhibitorDetails from "@/app/(frontend)/student/exhibitors/_components/ExhibitorDetails"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import Modal from "@/components/ui/Modal"

import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import { Card } from "@/components/ui/card"
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
          setModalOpen(false)
        }}
        className={` ${exhibitor.tier === "Gold" ? "bg-pineapple" : ""} ${exhibitor.tier === "Silver" ? "bg-gray-400" : ""} ${exhibitor.tier === "Bronze" ? "bg-melon-700" : ""} border-licorice min-w-[80vw] p-0`}>
        <div
          className={` ${exhibitor.tier === "Gold" ? "bg-pineapple" : ""} ${exhibitor.tier === "Silver" ? "bg-gray-400" : ""} ${exhibitor.tier === "Bronze" ? "bg-melon-700" : ""} border-licorice border-solid p-4 sm:p-10`}>
          <ExhibitorDetails exhibitor={exhibitor} />
        </div>
      </Modal>

      <Link href={`/student/exhibitors?id=${exhibitor.id}`} scroll={false}>
        <Card
          className={` ${exhibitor.tier === "Gold" ? "bg-pineapple" : ""} ${exhibitor.tier === "Silver" ? "bg-gray-400" : ""} ${exhibitor.tier === "Bronze" ? "bg-melon-700" : ""} group border-licorice flex h-full w-full max-w-[90vw] flex-col rounded-md border-2 border-solid px-3 filter transition hover:scale-[1.02] hover:brightness-95 sm:max-w-[380px]`}>
          <h3
            className={`font-bebas-neue xs:text-xl my-2 text-center text-2xl font-bold antialiased transition ${exhibitor.tier === "Gold" ? "text-yellow-100 group-hover:text-yellow-300" : ""} ${exhibitor.tier === "Silver" ? "text-gray-200 group-hover:text-gray-100" : ""} ${exhibitor.tier === "Bronze" ? "text-emerald-200 group-hover:text-emerald-700" : ""} `}>
            {exhibitor.name}
          </h3>

          {exhibitor.logoSquared || exhibitor.logoFreesize ? (
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
          )}
          <BadgeCollection
            items={exhibitor.industries ?? []}
            maxDisplayed={maxDisplayedBadges}
            className="mt-auto flex-nowrap justify-center overflow-hidden p-2.5 pt-0"
            badgeClassName="text-[0.65em] flex-initial truncate inline-block"
          />
        </Card>
      </Link>
    </>
  )
}
