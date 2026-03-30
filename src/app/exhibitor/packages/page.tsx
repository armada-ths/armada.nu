import { StatusModuleItem } from "@/app/exhibitor/_components/StatusModuleItem"
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
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Kits - Armada Exhibitor`,
  description:
    "The kits we offer for exhibitors at Armada. Choose between bronze, silver and gold."
}

export default async function Packages() {
  const showPackages = await feature("EXHIBITOR_PACKAGES")
  if (!showPackages) {
    return <ComingSoonPage title="Kits" />
  }
  const signupUrl = await getSignupUrl()

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-150">
          <Page.Header>Kits</Page.Header>
          <div className="mt-4">
            <p className="max-w-125">
              THS Armada strives to provide the best experience for all
              exhibitors through our exhibitor kits. The Bronze kit covers
              the basics, Silver expands your presence, and Gold makes you
              truly stand out with extra marketing and a dedicated event.
            </p>
          </div>
          <StatusModuleItem title="Did you know?">
            When we asked the students after the fair which exhibitors they
            remembered, Gold exhibitors were 3 times as likely to be remembered
            compared to Bronze exhibitors!
          </StatusModuleItem>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="mt-2 flex flex-col-reverse justify-stretch gap-10 md:flex-row">
            <Card className="bg-bronze relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-2xl">Bronze</h3>
              <ul className="font-lato mt-2">
                <li className="my-2 font-extrabold">
                  2x3 sqm, carpeted exhibitor space
                </li>
                <li className="my-2 font-extrabold">
                  Lunch for 4 representatives
                </li>
                <li className="my-2 font-extrabold">700 W of Electricity</li>
                <li className="my-2">Host service</li>
                <li className="my-2">Access to WiFi</li>
                <li className="my-2">Wardrobe & access to lounge</li>
              </ul>
              <div className="absolute bottom-4">
                <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p className="font-bold">45 000 SEK</p>
                <p className="text-sm">Standard registration price:</p>
                <p>48 000 SEK</p>
              </div>
              {/* 							<p className="absolute bottom-4">46 000 SEK*</p> */}
            </Card>
            <Card className="relative flex min-w-48 flex-1 flex-col rounded-lg bg-gray-400 p-5 pb-32">
              <h3 className="font-lato text-2xl">Silver</h3>
              <ul className="font-lato mt-2">
                <li className="my-2 font-extrabold">
                  2x4 sqm, carpeted exhibitor space
                </li>
                <li className="my-2 font-extrabold">
                  Second priority placement
                </li>
                <li className="my-2 font-extrabold">
                  Lunch for 6 representatives
                </li>
                <li className="my-2 font-extrabold">2 Armada Run Tickets</li>
                <li className="my-2 font-extrabold">2 Banquet tickets</li>
                <li className="my-2 font-extrabold">
                  Silver partner marketing on Armada platforms
                </li>
                <li className="my-2 font-extrabold">1200 W of Electricity</li>
                <li className="my-2">Host service</li>
                <li className="my-2">Access to WiFi</li>
                <li className="my-2">Wardrobe & access to lounge</li>
              </ul>
              <div className="absolute bottom-4">
                <p className="text-sm font-bold">
                  Priority Registration price:
                </p>
                <p className="font-bold">69 000 SEK</p>
                <p className="text-sm">Standard registration price:</p>
                <p>78 000 SEK</p>
              </div>
              {/* 							<p className="absolute bottom-4">71 500 SEK*</p> */}
            </Card>
            <Card className="bg-pineapple relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-licorice text-2xl">Gold</h3>
              <ul className="font-lato text-licorice mt-2">
                <li className="my-2 font-extrabold">
                  2x5 sqm. carpeted exhibitor space
                </li>
                <li className="my-2 font-extrabold">
                  First priority placement
                </li>
                <li className="my-2 font-extrabold">
                  Lunch for 8 representatives
                </li>
                <li className="my-2 font-extrabold">4 Armada Run tickets</li>
                <li className="my-2 font-extrabold">4 Banquet tickets</li>
                <li className="my-2 font-extrabold">
                  One event of your choosing (30 attendees)
                </li>
                <li className="my-2 text-sm ml-4">
                  Field visit, after work, or panel discussion
                </li>
                <li className="my-2 font-extrabold">
                  Customized email marketing to students
                </li>
                <li className="my-2 font-extrabold">
                  Gold partner marketing on Armada platforms
                </li>
                <li className="my-2 font-extrabold">2300 W of Electricity</li>
                <li className="my-2">Host service</li>
                <li className="my-2">Access to WiFi</li>
                <li className="my-2">Wardrobe & access to lounge</li>
              </ul>
              <div className="absolute bottom-4">
                <p className="text-sm font-bold">
                  Priority Registration price:
                </p>
                <p className="font-bold">105 000 SEK</p>
                <p className="text-sm">Standard registration price:</p>
                <p>120 000 SEK</p>
              </div>
              {/* 							<p className="absolute bottom-4">108 500 SEK*</p> */}
            </Card>
          </div>
        </div>
        {/* <p className="mt-4 text-sm">*All prices are ex. VAT. </p> */}
        <div className="mx-auto mt-12 w-full max-w-150">
          <h2 className="text-2xl font-bold">Custom Kit</h2>
          <p className="mt-2">
            Is a standard exhibitor kit missing something? We have you covered with
            additional options that may be tailored to your needs!
          </p>
          <ul className="mt-4 ml-4 list-disc space-y-2">
            <li>
              <strong>Additional exhibitor space</strong> — options to increase
              in both width and height are available for purchase
            </li>
            <li>
              <strong>Additional electricity</strong> — need more power? We can
              provide
            </li>
            <li>
              <strong>Social media ad</strong> — advertise your company&apos;s
              latest project, vacancies, or future plans through our social
              media platforms
            </li>
          </ul>
          <p className="mt-4 text-sm">
            Contact{" "}
            <Link
              className="underline hover:no-underline"
              href="mailto:sales@armada.nu">
              sales@armada.nu
            </Link>{" "}
            for custom options and pricing.
          </p>
          <h2 className="mt-8 text-2xl font-bold">Focus Rooms</h2>
          <p className="mt-2">
            To showcase our commitment to our core values Sustainability and
            Diversity, we&apos;ve created Focus Rooms during the fair for the
            companies that share our values. These rooms receive extra marketing
            attention and are highlighted during the fair.
          </p>
          <ul className="mt-4 ml-4 list-disc space-y-3">
            <li>
              <strong>Green Room</strong> — A place in the Green Room will
              highlight your sustainability work, a topic that becomes more and
              more important for students when looking for their future
              employer.
            </li>
            <li>
              <strong>Diversity Room</strong> — A place in the Diversity Room
              will spotlight your diversity initiatives, resonating with
              students seeking inclusive workplaces and enhancing your visibility
              during the fair.
            </li>
          </ul>
        </div>
        <div className="mx-auto mt-10 w-full max-w-150">
          <h1 className="mb-2 ml-2 text-2xl">FAQ</h1>
          <Accordion type="single" collapsible className="space-y-6">
            {/* FAQ 1 */}
            <AccordionItem value="faq-1">
              <AccordionTrigger>
                What does "priority placement" mean?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Priority placement means that we will place you in spots on
                  the fair where there is good footfall. Gold exhibitors take
                  the best spots and silver exhibitors are prioritized next.
                  Contact{" "}
                  <Link
                    className="underline hover:no-underline"
                    href="mailto:sales@armada.nu">
                    sales@armada.nu
                  </Link>{" "}
                  for more information.
                </p>
              </AccordionContent>
            </AccordionItem>
            {/* FAQ 2 */}
            <AccordionItem value="faq-2">
              <AccordionTrigger>
                What is the difference between Priority Registration and
                Standard Registration?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Priority Registration is where you apply to be an exhibitor.
                  You do not need to choose a kit yet.
                </p>
                <p className="mt-3">
                  Standard Registration is when you choose your kit,
                  events, banquet tickets, and other products in the
                  registration dashboard.
                </p>
                <p className="mt-3">
                  You can also choose to wait and sign up for the first time
                  during Standard Registration instead. If you do, you pay the
                  Standard Registration price rather than the lower Priority
                  Registration price.
                </p>
                <p className="mt-3">
                  See our{" "}
                  <Link
                    className="underline hover:no-underline"
                    href="/exhibitor/timeline">
                    timeline
                  </Link>{" "}
                  for more details and important dates.
                </p>
              </AccordionContent>
            </AccordionItem>
            {/* FAQ 3 */}
            <AccordionItem value="faq-3">
              <AccordionTrigger>How do I sign up for Armada?</AccordionTrigger>
              <AccordionContent>
                <p>You can sign up here:</p>
                <div className="my-4">
                  <TrackedLink
                    href={signupUrl}
                    tracking={{
                      eventName: "exhibitor_signup_click",
                      eventData: { location: "exhibitor_packages_faq" }
                    }}>
                    <Button className="bg-grapefruit text-snow">
                      Signup to Armada
                    </Button>
                  </TrackedLink>
                </div>
                <p>
                  If you have any questions, you can contact us at{" "}
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
