"use client"

import { P } from "@/app/_components/Paragraph"
import BadgeCollection from "@/app/student/exhibitors/_components/BadgeCollection"
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
  const hasIndustries = exhibitor.industries?.length > 0
  const hasEmployments = exhibitor.employments?.length > 0

  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    })
  }, [])

  if (!show) return null

  return (
    <div className="pb-5 @container">
      <div className="flex flex-col-reverse items-center gap-6 @sm:h-[100px] @sm:flex-row">
        {(exhibitor.logo_squared || exhibitor.logo_freesize) && (
          <Image
            className="h-20 w-auto object-contain @sm:h-full @sm:min-w-28 @sm:max-w-[25%]"
            src={exhibitor.logo_squared ?? exhibitor.logo_freesize ?? ""}
            alt={exhibitor.name}
            width={300}
            height={300}
          />
        )}
        <div className="flex flex-col items-center @sm:ml-2 @sm:block">
          <Page.Header className="text-center @sm:text-start">
            {exhibitor.name}
          </Page.Header>
          {exhibitor.company_website && (
            <div className="mt-2 flex items-center gap-1 text-base font-semibold text-stone-400">
              <Globe size={16} />
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href={exhibitor.company_website}
                className="line-clamp-1 transition-colors hover:text-emerald-100/90 hover:underline">
                {exhibitor.company_website}
              </Link>
            </div>
          )}
        </div>
      </div>
      {exhibitor.about && (
        <P className="mt-8 border-t border-stone-500 pt-4">{exhibitor.about}</P>
      )}
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
              items={exhibitor.industries}
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
              items={exhibitor.employments}
              maxDisplayed={20}
            />
          </div>
        )}
      </div>
    </div>
  )
}
