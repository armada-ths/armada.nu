import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import { uiText } from "@/i18n/ui"
import ExhibitorSearch from "@/app/[locale]/student/exhibitors/_components/ExhibitorSearch"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import {
  fetchEmployments,
  fetchExhibitors,
  fetchIndustries,
  fetchPrograms
} from "@/components/shared/hooks/api/useExhibitors"
import { Page } from "@/components/shared/Page"
import { translations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Suspense } from "react"

export async function generateMetadata() {
  const locale = await getRequestLocale()
  return pageMetadata("/student/exhibitors", {
    ...(await localeAlternates("/student/exhibitors")),
    title: translations[locale].companies
  })
}

export default async function ExhibitorsPage() {
  const locale = await getRequestLocale()
  const dict = translations[locale]
  const showExhibitors = await feature("EXHIBITOR_PAGE")
  if (!showExhibitors) {
    return <ComingSoonPage title={dict.companies} />
  }

  const exhibitors = await fetchExhibitors({
    next: { revalidate: 86400 }
  })

  const employments = await fetchEmployments({
    next: { revalidate: 86400 }
  })

  const industries = await fetchIndustries({
    next: { revalidate: 86400 }
  })

  const programs = await fetchPrograms({
    next: { revalidate: 86400 }
  })
  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>{uiText(locale, "companiesAtTheFair2026")}</Page.Header>{" "}
        {/* TODO: Make year dynamic based on CMS data */}
        <Suspense>
          <ExhibitorSearch
            exhibitors={exhibitors}
            employments={employments}
            industries={industries}
            programs={programs}
          />
        </Suspense>
      </Page.Boundary>
    </Page.Background>
  )
}
