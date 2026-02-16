"use client"

import { P } from "@/app/(frontend)/_components/Paragraph"
import BadgeCollection from "@/app/(frontend)/student/exhibitors/_components/BadgeCollection"
import { Page } from "@/components/shared/Page"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
import { cn } from "@/lib/utils"

import { Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ExhibitorDetails({
  exhibitor
}: {
  exhibitor: Exhibitor
}) {
  const hasIndustries = (exhibitor.industries ?? []).length > 0
  const hasEmployments = (exhibitor.employments ?? []).length > 0
  const hasPrograms = (exhibitor.programs ?? []).length > 0

  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="pb-5">
      {/* --- HEADER + LOGO --- */}
      <div className="flex flex-col-reverse items-center gap-6 sm:h-[100px] sm:flex-row">
        {(exhibitor.logoSquared || exhibitor.logoFreesize) && (
          <Image
            className="h-20 w-auto object-contain sm:h-full sm:max-w-[25%] sm:min-w-28"
            src={exhibitor.logoSquared ?? exhibitor.logoFreesize ?? ""}
            alt={exhibitor.name}
            width={300}
            height={300}
          />
        )}

        <div className="flex flex-col items-center sm:ml-2 sm:items-start">
          <Page.Header className={`text-licorice text-center sm:text-left`}>
            {exhibitor.name}
          </Page.Header>

          {exhibitor.companyWebsite && (
            <div className="mt-2 flex items-center gap-1 text-base font-semibold">
              <Globe size={16} />
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href={exhibitor.companyWebsite}
                className="line-clamp-1 overflow-hidden break-all transition-colors hover:text-emerald-100/90 hover:underline">
                {exhibitor.companyWebsite.length > 40
                  ? exhibitor.companyWebsite.slice(0, 40) + "..."
                  : exhibitor.companyWebsite}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --- ABOUT + MAP --- */}
      <div className="mt-8 flex flex-col gap-20 md:flex-row">
        {exhibitor.about && (
          <div className="flex-1">
            <P className="border-t border-stone-500 pt-4">{exhibitor.about}</P>
          </div>
        )}

        {exhibitor.mapImg && (
          <div className="flex shrink-0 justify-center">
            <Image
              className="h-80 w-auto rounded-lg object-contain"
              src={exhibitor.mapImg ?? ""}
              alt="Failed to load image"
              width={300}
              height={300}
            />
          </div>
        )}
      </div>

      {/* --- INDUSTRIES / EMPLOYMENTS / PROGRAMS --- */}
      <div
        className={cn("mt-10 grid grid-cols-1", {
          "gap-5 md:grid-cols-2": hasIndustries && hasEmployments
        })}>
        {hasIndustries && (
          <div>
            <Page.Header tier="secondary" className="mt-2 pl-1">
              Industries
            </Page.Header>
            <BadgeCollection
              className="mt-2 flex-wrap gap-2"
              items={exhibitor.industries ?? []}
              maxDisplayed={20}
            />
          </div>
        )}

        {hasEmployments && (
          <div>
            <Page.Header tier="secondary" className="mt-2 pl-1">
              Employments
            </Page.Header>
            <BadgeCollection
              className="mt-2 gap-2"
              items={exhibitor.employments ?? []}
              maxDisplayed={20}
            />
          </div>
        )}

        {hasPrograms && (
          <div>
            <Page.Header tier="secondary" className="mt-2 pl-1">
              Programs
            </Page.Header>
            <BadgeCollection
              className="mt-2 gap-2"
              items={exhibitor.programs ?? []}
              maxDisplayed={20}
            />
          </div>
        )}
      </div>
    </div>
  )
}
