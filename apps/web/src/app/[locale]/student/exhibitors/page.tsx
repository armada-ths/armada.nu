import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import { uiText } from "@/i18n/ui"
import ExhibitorSearch from "@/app/[locale]/student/exhibitors/_components/ExhibitorSearch"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { Button } from "@/components/ui/button"
import { Page } from "@/components/shared/Page"
import { translations } from "@/i18n/dictionaries"
import { getRequestLocale } from "@/lib/i18n-server"
import { Link } from "@armada/shared/i18n/navigation"
import { MapPin } from "lucide-react"
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
  const [showExhibitors, mapEnabled] = await Promise.all([
    feature("EXHIBITOR_PAGE"),
    feature("MAP_PAGE")
  ])
  if (!showExhibitors) {
    return <ComingSoonPage title={dict.companies} />
  }

  const exhibitors = await fetchExhibitors({
    next: { revalidate: 86400 }
  })

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Page.Header>{uiText(locale, "companiesAtTheFair2026")}</Page.Header>
          {mapEnabled && (
            <Button asChild variant="neutral" size="sm">
              <Link href="/student/map">
                <MapPin aria-hidden="true" />
                {dict.map}
              </Link>
            </Button>
          )}
        </div>
        {/* TODO: Make year dynamic based on CMS data */}
        <Suspense>
          <ExhibitorSearch exhibitors={exhibitors} mapEnabled={mapEnabled} />
        </Suspense>
      </Page.Boundary>
    </Page.Background>
  )
}
