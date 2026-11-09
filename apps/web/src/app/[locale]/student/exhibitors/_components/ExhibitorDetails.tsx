"use client"
import { uiText } from "@/i18n/ui"

import { useLocale } from "@armada/shared/i18n/client"
import { normalizeLocale, localizedText } from "@armada/shared/i18n/routing"

import { P } from "@/app/_components/Paragraph"
import BadgeCollection from "@/app/[locale]/student/exhibitors/_components/BadgeCollection"
import { Page } from "@/components/shared/Page"
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"

import { cn, shouldBypassNextImageOptimization } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Globe, MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Link } from "@armada/shared/i18n/navigation"

import { useEffect, useState } from "react"

export default function ExhibitorDetails({
  exhibitor,
  mapPlacementId
}: {
  exhibitor: Exhibitor
  mapPlacementId?: string
}) {
  const t = useTranslations("FairMap")
  const locale = normalizeLocale(useLocale())
  const about = localizedText(locale, exhibitor.about, exhibitor.aboutSv)
  const logoSrc =
    exhibitor.logoSquared ??
    exhibitor.logoThumbnail ??
    exhibitor.logoFreesize ??
    ""
  const shouldBypassLogoOptimization =
    shouldBypassNextImageOptimization(logoSrc)
  const shouldBypassMapOptimization = shouldBypassNextImageOptimization(
    exhibitor.mapImg
  )
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
      <div className="flex flex-col-reverse items-center gap-6 sm:min-h-25 sm:flex-row">
        {(exhibitor.logoSquared ||
          exhibitor.logoThumbnail ||
          exhibitor.logoFreesize) && (
          <Image
            className="h-20 w-auto object-contain sm:h-25 sm:max-w-[25%] sm:min-w-28"
            src={logoSrc}
            alt={exhibitor.name}
            unoptimized={shouldBypassLogoOptimization}
            width={300}
            height={300}
          />
        )}

        <div className="flex min-w-0 flex-wrap items-start justify-center gap-x-8 gap-y-3 sm:ml-2 sm:justify-start">
          <div className="flex max-w-full min-w-0 flex-col items-center sm:items-start">
            <Page.Header className="text-licorice text-center sm:text-left">
              {exhibitor.name}
            </Page.Header>
            {exhibitor.companyWebsite && (
              <div className="mt-2 flex min-w-0 items-center gap-1 text-base font-semibold">
                <Globe size={16} className="shrink-0" />
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href={exhibitor.companyWebsite}
                  className="line-clamp-1 overflow-hidden break-all hover:underline">
                  {exhibitor.companyWebsite.length > 40
                    ? exhibitor.companyWebsite.slice(0, 40) + "..."
                    : exhibitor.companyWebsite}
                </Link>
              </div>
            )}
          </div>
          {mapPlacementId !== undefined && (
            <Button asChild variant="neutral" size="sm" className="shrink-0">
              <Link href={`/student/map?id=${mapPlacementId}`} prefetch={false}>
                <MapPin aria-hidden="true" />
                {t("showOnMap")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* --- ABOUT + MAP --- */}
      <div className="mt-8 flex flex-col gap-20 md:flex-row">
        {about && (
          <div className="flex-1">
            <P className="border-t border-stone-500 pt-4">{about}</P>
          </div>
        )}

        {exhibitor.mapImg && (
          <div className="flex shrink-0 justify-center">
            <Image
              className="h-80 w-auto rounded-lg object-contain"
              src={exhibitor.mapImg ?? ""}
              alt={uiText(locale, "mapOfExhibitorLocation")}
              unoptimized={shouldBypassMapOptimization}
              width={300}
              height={300}
            />
          </div>
        )}
      </div>

      {exhibitor.cities && (
        <div className="mt-8">
          <Page.Header tier="secondary" className="mt-2 pl-1">
            {uiText(locale, "locations")}
          </Page.Header>
          <P className="mt-2">{exhibitor.cities}</P>
        </div>
      )}

      {/* --- INDUSTRIES / EMPLOYMENTS / PROGRAMS --- */}
      <div
        className={cn("mt-10 grid grid-cols-1", {
          "gap-5 md:grid-cols-2": hasIndustries && hasEmployments
        })}>
        {hasIndustries && (
          <div>
            <Page.Header tier="secondary" className="mt-2 pl-1">
              {uiText(locale, "industries")}
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
              {uiText(locale, "employments")}
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
              {uiText(locale, "programs")}
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
