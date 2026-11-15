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
import { packagesPageTranslations } from "@/i18n/dictionaries"
import { localeAlternates, pageMetadata } from "@/i18n/metadata"
import { LocalizedText } from "@/i18n/text"
import { getRequestLocale } from "@/lib/i18n-server"
import { Link } from "@armada/shared/i18n/navigation"
import { Check } from "lucide-react"
import { Metadata } from "next"
import { getFormatter } from "next-intl/server"

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

  // Index of "One event of your choosing" in goldItems (after dict reordering to match Figma)
  const goldEventIndex = 7

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div>
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
            {/* Bronze */}
            <div className="flex min-w-48 flex-1 flex-col">
              <div className="shadow-shadow rounded-base border-licorice bg-bronze flex items-center justify-center border-2 px-4 py-4">
                <span className="font-bebas-neue text-licorice text-[32px] leading-none">
                  <LocalizedText id="bronze" />
                </span>
              </div>
              <div className="shadow-shadow rounded-base border-licorice bg-snow mt-2 flex flex-1 flex-col border-2 px-[18px] py-6">
                <ul className="flex flex-col gap-[10px]">
                  {dict.bronzeItems.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="text-licorice mt-0.5 size-4 shrink-0" />
                      <span className="font-lato text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col items-center justify-center py-6 text-center">
                  <p className="font-lato text-licorice text-[17px] font-semibold">
                    {dict.standardRegistrationPrice}
                  </p>
                  <p className="font-lato text-licorice text-xl font-bold">
                    {format.number(48000, {
                      style: "currency",
                      currency: "SEK",
                      maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Silver */}
            <div className="flex min-w-48 flex-1 flex-col">
              <div className="shadow-shadow rounded-base border-licorice bg-silver flex items-center justify-center border-2 px-4 py-4">
                <span className="font-bebas-neue text-licorice text-[32px] leading-none">
                  <LocalizedText id="silver" />
                </span>
              </div>
              <div className="shadow-shadow rounded-base border-licorice bg-snow mt-2 flex flex-1 flex-col border-2 px-[18px] py-6">
                <ul className="flex flex-col gap-[10px]">
                  {dict.silverItems.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="text-licorice mt-0.5 size-4 shrink-0" />
                      <span className="font-lato text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col items-center justify-center py-6 text-center">
                  <p className="font-lato text-licorice text-[17px] font-semibold">
                    {dict.standardRegistrationPrice}
                  </p>
                  <p className="font-lato text-licorice text-xl font-bold">
                    {format.number(78000, {
                      style: "currency",
                      currency: "SEK",
                      maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Gold */}
            <div className="flex min-w-48 flex-1 flex-col">
              <div className="shadow-shadow rounded-base border-licorice bg-pineapple flex items-center justify-center border-2 px-4 py-4">
                <span className="font-bebas-neue text-licorice text-[32px] leading-none">
                  <LocalizedText id="gold" />
                </span>
              </div>
              <div className="shadow-shadow rounded-base border-licorice bg-snow mt-2 flex flex-1 flex-col border-2 px-[18px] py-6">
                <ul className="flex flex-col gap-[10px]">
                  {dict.goldItems.map((item, index) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="text-licorice mt-0.5 size-4 shrink-0" />
                      {index === goldEventIndex ? (
                        <div>
                          <span className="font-lato text-sm">{item}:</span>
                          <p className="font-lato text-sm">
                            {dict.goldEventDetails}
                          </p>
                        </div>
                      ) : (
                        <span className="font-lato text-sm">{item}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col items-center justify-center py-6 text-center">
                  <p className="font-lato text-licorice text-[17px] font-semibold">
                    {dict.standardRegistrationPrice}
                  </p>
                  <p className="font-lato text-licorice text-xl font-bold">
                    {format.number(120000, {
                      style: "currency",
                      currency: "SEK",
                      maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
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
        <div className="mt-10">
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
