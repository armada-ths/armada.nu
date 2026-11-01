import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { CurrentStatus } from "@/app/[locale]/exhibitor/_components/CurrentStatus"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature, getSignupUrl } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { VisitorNumberBar } from "@/components/shared/VisitorNumberBar"
import { Button } from "@/components/ui/button"

import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"
import { Link } from "@armada/shared/i18n/navigation"

import { exhibitorPageTranslations } from "@/i18n/dictionaries"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()

  return pageMetadata("/exhibitor", {
    ...(await localeAlternates("/exhibitor")),
    title: exhibitorPageTranslations[locale].metadataTitle
  })
}

export default async function ForExhibitorsPage() {
  const locale = await getRequestLocale()
  const dict = exhibitorPageTranslations[locale]

  const showExhibitorMain = await feature("EXHIBITOR_MAIN_PAGE")
  if (!showExhibitorMain) {
    return <ComingSoonPage title={dict.comingSoonTitle} />
  }

  const signupUrl = await getSignupUrl()
  const promotionalPhotos: { source: string; altText: string }[] = [
    {
      source: "/fair_pictures/49121473038_5876d71e29_b.jpg",
      altText: dict.photos[0]
    },
    {
      source: "/fair_pictures/49121988801_f0b111943f_k.jpg",
      altText: dict.photos[1]
    },
    {
      source: "/fair_pictures/49122130686_297ea7d00a_o.jpg",
      altText: dict.photos[2]
    },
    {
      source: "/fair_pictures/53396499463_86ddb61379_k.jpg",
      altText: dict.photos[3]
    }
  ]
  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={600} className="pb-20">
        <Page.Header tier="primary">{dict.heading}</Page.Header>
        <div className="h-4" />

        <VisitorNumberBar labels={dict.visitorLabels} />

        <div className="flex flex-col space-y-4 py-6">
          <div className="mt-2 flex flex-row flex-wrap justify-stretch gap-4">
            <Button asChild className="bg-grapefruit text-snow">
              <TrackedLink
                href={signupUrl}
                tracking={{
                  eventName: "exhibitor_signup_click",
                  eventData: { location: "exhibitor_why_armada" }
                }}>
                {dict.signupButton}
              </TrackedLink>
            </Button>
            <Button asChild variant={"neutral"}>
              <Link href={"/exhibitor/packages"}>{dict.packagesButton}</Link>
            </Button>
            <Button asChild variant={"neutral"}>
              <Link href={"/exhibitor/timeline"}>{dict.timelineButton}</Link>
            </Button>
          </div>
          <p className="text-xs">
            {dict.contactPrefix}{" "}
            <Link
              className="underline hover:no-underline"
              href="mailto:sales@armada.nu">
              {dict.contactLink}
            </Link>{" "}
            {dict.contactSuffix}
          </p>
        </div>
        <CurrentStatus />
        <section className="flex flex-col gap-y-12">
          <div className="mt-12">
            <Page.Header tier="secondary">
              {dict.newStudentsHeading}
            </Page.Header>
            <P>{dict.newStudentsBody}</P>
          </div>

          <div>
            <Page.Header tier="secondary">{dict.characterHeading}</Page.Header>
            <P>{dict.characterBody}</P>
          </div>
          <div>
            <Page.Header tier="secondary">{dict.skillsHeading}</Page.Header>
            <P>{dict.skillsBody}</P>
          </div>
        </section>
        <PhotoSlideCarousel photoSrc={promotionalPhotos} />
      </Page.Boundary>
    </Page.Background>
  )
}
