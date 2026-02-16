import { StatusModuleItem } from "@/app/(frontend)/exhibitor/_components/StatusModuleItem"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { Page } from "@/components/shared/Page"
import { feature, getSignupUrl } from "@/components/shared/feature"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Packages - Armada Exhibitor`,
  description:
    "The packages we offer for exhibitors at Armada. Choose between bronze, silver and gold."
}

export default async function Packages() {
  const showPackages = await feature("EXHIBITOR_PACKAGES")
  if (!showPackages) {
    return <ComingSoonPage title="Packages" />
  }
  const signupUrl = await getSignupUrl()


  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-[600px]">
          <Page.Header>Packages</Page.Header>
          <div className="mt-4">
            <p className="max-w-[500]">
              Armada has the following packages. The Bronze package is all the
              basics you need to exhibit at Armada. The Silver package allows
              you to expand your presence and the Gold package makes you truly
              stand out from the rest through extra marketing.
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
            <Card className="bg-melon-700 relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-2xl">Bronze</h3>
              <ul className="font-lato mt-2">
                <li className="my-2 font-extrabold">
                  2x3 sqm, carpeted exhibitor space
                </li>
                <li className="my-2 font-extrabold">Host service</li>
                <li className="my-2 font-extrabold">
                  Lunch for 4 representatives
                </li>
                <li className="my-2">Access to WiFi</li>
                <li className="my-2">700 W of Electricity</li>
                <li className="my-2">Wardrobe & access to lounge</li>
              </ul>
              {/* <div className="absolute bottom-4">
                <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p>43 300 SEK*</p>
                <p className="text-sm">Standard registration price:</p>
                <p>46 500 SEK*</p>
              </div> */}
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
                <li className="my-2 font-extrabold">Host service</li>
                <li className="my-2 font-extrabold">
                  Lunch for 6 representatives
                </li>
                <li className="my-2 font-extrabold">2 Armada Run Tickets</li>
                <li className="my-2 font-extrabold">2 Banquet tickets</li>
                <li className="my-2 font-extrabold">
                  Silver Partner Marketing on THS Armada Platforms
                </li>
                <li className="my-2">Access to WiFi</li>
                <li className="my-2">1200 W of Electricity</li>
                <li className="my-2">Wardrobe & access to lounge</li>
              </ul>
              {/* <div className="absolute bottom-4">
                <p className="text-sm font-bold">
                  Priority Registration price:
                </p>
                <p>68 900 SEK*</p>
                <p className="text-sm">Standard registration price:</p>
                <p>75 800 SEK*</p>
              </div> */}
              {/* 							<p className="absolute bottom-4">71 500 SEK*</p> */}
            </Card>
            <Card className="bg-pineapple relative flex min-w-48 flex-1 flex-col rounded-lg p-5 pb-32">
              <h3 className="font-lato text-licorice text-2xl">Gold</h3>
              <ul className="font-lato text-licorice mt-2">
                <li className="my-2 font-extrabold">
                  2x5 sqm booth, carpeted exhibitor space
                </li>
                <li className="my-2 font-extrabold">
                  First priority placement
                </li>
                <li className="my-2 font-extrabold">Host service</li>
                <li className="my-2 font-extrabold">
                  Lunch for 8 representatives
                </li>
                <li className="my-2 font-extrabold">4 Armada Run Tickets</li>
                <li className="my-2 font-extrabold">4 Banquet Tickets</li>
                <li className="my-2 font-extrabold">
                  A spot as a speaker in the panel discussion of your choice
                </li>
                <li className="my-2 font-extrabold">
                  Customized email marketing to students
                </li>
                <li className="my-2 font-extrabold">
                  4 hours of contact calls (1:1)
                </li>
                <li className="my-2 font-extrabold">
                  Gold Partner Marketing on THS Armada Platforms
                </li>
                <li className="my-2">Access to WiFi</li>
                <li className="my-2">2300 W of Electricity</li>
                <li className="my-2">Wardrobe & access to lounge</li>
              </ul>
              {/* <div className="absolute bottom-4">
                <p className="text-sm font-bold">
                  Priority Registration price:
                </p>
                <p>107 500 SEK*</p>
                <p className="text-sm">Standard registration price:</p>
                <p>118 200 SEK*</p>
              </div> */}
              {/* 							<p className="absolute bottom-4">108 500 SEK*</p> */}
            </Card>
          </div>
        </div>
        {/* <p className="mt-4 text-sm">*All prices are ex. VAT. </p> */}
        <div className="mx-auto mt-10 w-full max-w-[600px]">
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
                When is the deadline for Priority Registration?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  The Priority Registration ends {formatDate("2025-05-23")}. See
                  our{" "}
                  <Link
                    className="underline hover:no-underline"
                    href="/exhibitor/timeline">
                    timeline
                  </Link>{" "}
                  for more information and other important dates.
                </p>
              </AccordionContent>
            </AccordionItem>
            {/* FAQ 3 */}
            <AccordionItem value="faq-3">
              <AccordionTrigger>How do I sign up for Armada?</AccordionTrigger>
              <AccordionContent>
                <p>You can sign up here:</p>
                <div className="my-4">
                  <Link href={signupUrl}>
                    <Button className="bg-grapefruit text-snow">
                      Signup to Armada
                    </Button>
                  </Link>
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
