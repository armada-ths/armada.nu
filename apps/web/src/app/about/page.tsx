import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { OrganisationMembersGraphic } from "@/app/about/_components/OrganisationMembersGraphic"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"
import { pageTranslations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"
import Link from "next/link"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = pageTranslations[locale].aboutPage

  return {
    title: dict.metadataTitle,
    description: dict.metadataDescription
  }
}

export default async function RecruitmentPage() {
  const locale = await getRequestLocale()
  const dict = pageTranslations[locale].aboutPage
  const showAboutPage = await feature("ABOUT_PAGE")
  if (!showAboutPage) {
    return <ComingSoonPage title={dict.comingSoonTitle} />
  }

  const photoSrc: { source: string; altText: string }[] = [
    {
      source: "/fair_pictures/23031965122_efd3a80707_c.jpg",
      altText: dict.photos[0]
    },
    {
      source: "/fair_pictures/53396499463_86ddb61379_k.jpg",
      altText: dict.photos[1]
    },
    {
      source: "/fair_pictures/49121988801_f0b111943f_k.jpg",
      altText: dict.photos[2]
    },
    {
      source: "/fair_pictures/49122130686_297ea7d00a_o.jpg",
      altText: dict.photos[3]
    }
  ]

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={750}>
        <Page.Header>{dict.heading}</Page.Header>
        <PhotoSlideCarousel photoSrc={photoSrc} />
        <P className="mt-4">{dict.intro}</P>
        <P className="mt-4">
          {dict.ownershipPrefix}{" "}
          <Link
            className="underline hover:no-underline"
            href="https://thskth.se/en/">
            {dict.thsLinkLabel}
          </Link>
          {dict.ownershipSuffix}
        </P>

        <div className="flex w-full justify-center">
          <OrganisationMembersGraphic />
        </div>

        <div className="mt-8">
          <Page.Header tier="secondary">{dict.pmHeading}</Page.Header>
          <P>{dict.pmBody}</P>
        </div>
        <div className="mt-8">
          <Page.Header tier="secondary">{dict.projectGroupHeading}</Page.Header>
          <P>{dict.projectGroupBody}</P>
        </div>
        <div className="mt-8">
          <Page.Header tier="secondary">
            {dict.operationsTeamHeading}
          </Page.Header>
          <P>{dict.operationsTeamBody}</P>
        </div>
        <div className="mt-8">
          <Page.Header tier="secondary">{dict.hostsHeading}</Page.Header>
          <P>{dict.hostsBody}</P>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
