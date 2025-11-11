"use client"

import BadgeCollection from "@/app/student/exhibitors/_components/BadgeCollection"
import ExhibitorDetails from "@/app/student/exhibitors/_components/ExhibitorDetails"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import Modal from "@/components/ui/Modal"

import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function ExhibitorCard({ exhibitor }: { exhibitor: Exhibitor }) {
  const searchParams = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  const { width } = useScreenSize()
  const maxDisplayedBadges = width && width < 470 ? 2 : 1

  useEffect(() => {
    const queryId = searchParams.get("id")
    if (queryId === exhibitor.id.toString()) setModalOpen(true)
    else setModalOpen(false)
  }, [exhibitor, searchParams])



  // VERY IMPORTANT: makes the card tilt and adds cool shadow 🤠🤠


  const [selected, setSelected] = useState<null | typeof exhibitor>(null);

  // Function to handle the "lean" effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to card center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt value
    const maxTilt = 15;

    // Calculate rotation:
    // rotateX is based on Y-movement. (y - centerY) is negative at the top.
    // rotateY is based on X-movement. (x - centerX) is negative on the left.
    const rotateX = ((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    // Calculate shadow offset for 3D depth
    const shadowX = -rotateY * 0.8; // Opposite of rotateY for parallax effect
    const shadowY = rotateX * 0.8;  // Matches rotateX (to look like it's lifting)

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.boxShadow = `${shadowX}px ${shadowY}px 25px rgba(0, 255, 0, 0.4)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    // Reset to a subtle default shadow
    card.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.4)";
  };

  return (
    <>
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        onClose={() => {
          router.push("/student/exhibitors", { scroll: false })
        }}
        className="max-w-[1000px] bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 p-0">
        <div className="p-4 sm:p-10">
          <ExhibitorDetails exhibitor={exhibitor} />

        </div>
      </Modal>

      <Link href={`/student/exhibitors?id=${exhibitor.id}`} scroll={false}>
        <div
          className=" zto-liqorice-950 group relative flex h-full flex-col border-2 border-solid border-emerald-900 bg-gradient-to-b from-emerald-900 via-emerald-950 filter transition hover:scale-[1.05] hover:brightness-95"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >

          <h3 className="my-2 text-center font-bebas-neue text-2xl text-emerald-100 antialiased transition group-hover:text-melon-700 xs:text-xl">
            {exhibitor.name}
          </h3>

          {(exhibitor.logoSquared || exhibitor.logoFreesize) ? (
            <div className="relative mt-2 flex h-[80px] w-full flex-initial justify-center overflow-hidden">
              <Image
                className="h-full w-full object-contain"
                src={exhibitor.logoSquared ?? exhibitor.logoFreesize ?? ""}
                alt={exhibitor.name}
                width={300}
                height={300}
              />
            </div>
          ) : (
            <div className="relative mt-2 flex h-[80px] w-full flex-initial justify-center overflow-hidden" />
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
