"use client"

import BadgeCollection from "@/app/student/exhibitors/_components/BadgeCollection"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"

import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import { Card } from "@/components/ui/card"
import { shouldBypassNextImageOptimization } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export function ExhibitorCard({ exhibitor }: { exhibitor: Exhibitor }) {
  const logoSrc =
    exhibitor.logoSquared ??
    exhibitor.logoThumbnail ??
    exhibitor.logoFreesize ??
    ""
  const shouldBypassLogoOptimization =
    shouldBypassNextImageOptimization(logoSrc)

  const { width } = useScreenSize()
  const maxDisplayedBadges = width && width < 470 ? 2 : 1

  return (
    <Link
      href={`/student/exhibitors?id=${exhibitor.id}`}
      data-exhibitor-id={exhibitor.id}
      scroll={false}
      prefetch={false}>
      <Card
        className={` ${exhibitor.tier === "Gold" ? "bg-pineapple" : ""} ${exhibitor.tier === "Silver" ? "bg-silver" : ""} ${exhibitor.tier === "Bronze" ? "bg-bronze" : ""} group border-licorice flex h-full w-full max-w-[90vw] flex-col rounded-md border-2 border-solid px-3 filter transition hover:scale-[1.02] hover:brightness-95 sm:max-w-95`}>
        <h3
          className={`font-bebas-neue xs:text-xl my-2 text-center text-2xl font-bold antialiased transition ${exhibitor.tier === "Gold" ? "text-yellow-100 group-hover:text-yellow-300" : ""} ${exhibitor.tier === "Silver" ? "text-gray-200 group-hover:text-gray-100" : ""} ${exhibitor.tier === "Bronze" ? "text-stone-100 group-hover:text-yellow-100" : ""} `}>
          {exhibitor.name}
        </h3>

        {exhibitor.logoSquared ||
        exhibitor.logoThumbnail ||
        exhibitor.logoFreesize ? (
          <div className="relative my-2 flex h-20 w-full flex-initial justify-center overflow-hidden">
            <Image
              className="h-full w-full object-contain"
              src={logoSrc}
              alt={exhibitor.name}
              unoptimized={shouldBypassLogoOptimization}
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
  )
}
