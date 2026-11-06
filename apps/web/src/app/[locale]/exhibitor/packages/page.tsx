import { pageMetadata } from "@/i18n/metadata"
import { getFormatter } from "next-intl/server"
import { localeAlternates } from "@/i18n/metadata"
import { LocalizedText } from "@/i18n/text"
import { StatusModuleItem } from "@/app/[locale]/exhibitor/_components/StatusModuleItem"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { Page } from "@/components/shared/Page"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { feature, getSignupUrl } from "@/components/shared/feature"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"
import { Link } from "@armada/shared/i18n/navigation"

import { packagesPageTranslations } from "@/i18n/dictionaries"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = packagesPageTranslations[locale]

  return pageMetadata("/exhibitor/packages", {
    ...(await localeAlternates("/exhibitor/packages")),
    title: dict.metadataTitle,
    description: dict.metadataDescription
  })
}

export default async function ExhibitorPackagesPage() {
  const locale = await getRequestLocale()
  const dict = packagesPageTranslations[locale]
  const format = await getFormatter()

  const showPackages = await feature("EXHIBITOR_PACKAGES")
  if (!showPackages) {
    return <ComingSoonPage title={dict.comingSoonTitle} />
  }
  const signupUrl = await getSignupUrl()

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-150">
          <Page.Header>{dict.heading}</Page.Header>
          <div className="mt-4">
            <p className="max-w-125">{dict.intro}</p>
          </div>
          <StatusModuleItem title={dict.didYouKnowTitle}>
            <p>{dict.didYouKnowBody}</p>
          </StatusModuleItem>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="mt-2 flex flex-col-reverse justify-stretch gap-10 md:flex-row">
            <Card className="bg-bronze relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-2xl">
                <LocalizedText id="bronze" />
              </h3>
              <ul className="font-lato mt-2">
                {dict.bronzeItems.map((item, index) => (
                  <li
                    className={index < 3 ? "my-2 font-extrabold" : "my-2"}
                    key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-4">
                {/* <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p className="font-bold">45 000 SEK</p> */}
                <p className="text-sm font-bold">
                  {dict.standardRegistrationPrice}
                </p>
                <p className="font-bold">
                  {format.number(48000, {
                    style: "currency",
                    currency: "SEK",
                    maximumFractionDigits: 0
                  })}
                </p>
              </div>
              {/* 							<p className="absolute bottom-4">46 000 SEK*</p> */}
            </Card>
            <Card className="bg-silver relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-2xl">
                <LocalizedText id="silver" />
              </h3>
              <ul className="font-lato mt-2">
                {dict.silverItems.map((item, index) => (
                  <li
                    className={index < 7 ? "my-2 font-extrabold" : "my-2"}
                    key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-4">
                {/* <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p className="font-bold">69 000 SEK</p> */}
                <p className="text-sm font-bold">
                  {dict.standardRegistrationPrice}
                </p>
                <p className="font-bold">
                  {format.number(78000, {
                    style: "currency",
                    currency: "SEK",
                    maximumFractionDigits: 0
                  })}
                </p>
              </div>
              {/* 							<p className="absolute bottom-4">71 500 SEK*</p> */}
            </Card>
            <Card className="bg-pineapple relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-licorice text-2xl">
                <LocalizedText id="gold" />
              </h3>
              <ul className="font-lato text-licorice mt-2">
                {dict.goldItems.slice(0, 6).map(item => (
                  <li className="my-2 font-extrabold" key={item}>
                    {item}
                  </li>
                ))}
                <li className="my-2 ml-4 text-sm">{dict.goldEventDetails}</li>
                {dict.goldItems.slice(6).map((item, index) => (
                  <li
                    className={index < 3 ? "my-2 font-extrabold" : "my-2"}
                    key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-4">
                {/* <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p className="font-bold">105 000 SEK</p> */}
                <p className="text-sm font-bold">
                  {dict.standardRegistrationPrice}
                </p>
                <p className="font-bold">
                  {format.number(120000, {
                    style: "currency",
                    currency: "SEK",
                    maximumFractionDigits: 0
                  })}
                </p>
              </div>
              {/* 							<p className="absolute bottom-4">108 500 SEK*</p> */}
            </Card>
          </div>
        </div>
        {/* <p className="mt-4 text-sm">*All prices are ex. VAT. </p> */}
        <div className="mx-auto mt-12 w-full max-w-150">
          <Page.Header tier="secondary">{dict.customKitHeading}</Page.Header>
          <p className="mt-2">{dict.customKitIntro}</p>
          <ul className="mt-4 ml-4 list-disc space-y-2">
            {dict.customKitItems.map(item => (
              <li key={item.title}>
                <strong>{item.title}</strong> — {item.body}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            {dict.customKitContactPrefix}{" "}
            <Link
              className="underline hover:no-underline"
              href="mailto:sales@armada.nu">
              sales@armada.nu
            </Link>{" "}
            {dict.customKitContactSuffix}
          </p>
          <Page.Header tier="secondary" className="mt-8">
            {dict.focusRoomsHeading}
          </Page.Header>
          <p className="mt-2">{dict.focusRoomsIntro}</p>
          <ul className="mt-4 ml-4 list-disc space-y-3">
            {dict.focusRoomItems.map(item => (
              <li key={item.title}>
                <strong>{item.title}</strong> — {item.body}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto mt-10 w-full max-w-150">
          <Page.Header tier="secondary" className="mb-3">
            {dict.faqHeading}
          </Page.Header>
          <Accordion type="single" collapsible className="space-y-6">
            {/* FAQ 1 */}
            <AccordionItem value="faq-1">
              <AccordionTrigger>{dict.priorityQuestion}</AccordionTrigger>
              <AccordionContent>
                <p>
                  {dict.priorityAnswerPrefix}{" "}
                  <Link
                    className="underline hover:no-underline"
                    href="mailto:sales@armada.nu">
                    sales@armada.nu
                  </Link>{" "}
                  {dict.priorityAnswerSuffix}
                </p>
              </AccordionContent>
            </AccordionItem>
            {/* FAQ 2 */}
            <AccordionItem value="faq-2">
              <AccordionTrigger>{dict.registrationQuestion}</AccordionTrigger>
              <AccordionContent>
                <p>{dict.priorityRegistrationAnswer}</p>
                <p className="mt-3">{dict.standardRegistrationAnswer}</p>
                <p className="mt-3">{dict.firstSignupAnswer}</p>
                <p className="mt-3">
                  {dict.timelinePrefix}{" "}
                  <Link
                    className="underline hover:no-underline"
                    href={"/exhibitor/timeline"}>
                    {dict.timelineLink}
                  </Link>{" "}
                  {dict.timelineSuffix}
                </p>
              </AccordionContent>
            </AccordionItem>
            {/* FAQ 3 */}
            <AccordionItem value="faq-3">
              <AccordionTrigger>{dict.signupQuestion}</AccordionTrigger>
              <AccordionContent>
                <p>{dict.signupIntro}</p>
                <div className="my-4">
                  <TrackedLink
                    href={signupUrl}
                    tracking={{
                      eventName: "exhibitor_signup_click",
                      eventData: { location: "exhibitor_packages_faq" }
                    }}>
                    <Button className="bg-grapefruit text-snow">
                      {dict.signupButton}
                    </Button>
                  </TrackedLink>
                </div>
                <p>
                  {dict.signupContactPrefix}{" "}
                  <Link
                    className="underline hover:no-underline"
                    href="mailto:sales@armada.nu">
                    sales@armada.nu
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
