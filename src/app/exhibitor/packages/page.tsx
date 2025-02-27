import { StatusModuleItem } from "@/app/exhibitor/_components/StatusModuleItem"
import { Page } from "@/components/shared/Page"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Packages - Armada Exhibitor`,
  description:
    "The packages we offer for exhibitors at Armada. Choose between bronze, silver and gold."
}

function FAQItem({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <AccordionItem value={title} className="border-none">
      <AccordionTrigger className="mb-0 w-full rounded px-2 py-4 text-left font-normal transition hover:bg-slate-700 hover:no-underline">
        <h3 className="text-xl">{title}</h3>
      </AccordionTrigger>
      <AccordionContent className="mt-0 p-2 pt-0 text-base text-stone-400">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

export default async function Packages() {
  const dates = await fetchDates()

  return (
    <Page.Background withIndents>
      <Page.Boundary className="pb-20">
        <div className="mx-auto max-w-[600px]">
          <Page.Header>Packages</Page.Header>
          <div className="mt-4">
            <p className="max-w-[500] text-stone-400">
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
            <div className="relative flex min-w-48 flex-1 flex-col rounded-lg bg-orange-950 p-5 pb-32">
              <h3 className="font-lato text-2xl text-orange-500">Bronze</h3>
              <ul className="mt-2 font-lato text-orange-600">
                <li className="my-2">2x3 sqm. Carpeted Exhibitor Space</li>
                <li className="my-2">700 W of Electricity</li>
                <li className="my-2">Personal Host Service</li>
                <li className="my-2">Lunch for 4 representatives</li>
                <li className="my-2">Access to WiFi</li>
              </ul>
              <div className="absolute bottom-4">
                <p className="text-sm font-bold">
                  Priority registration price:
                </p>
                <p>43 300 SEK*</p>
                <p className="text-sm">Standard registration price:</p>
                <p>46 500 SEK*</p>
              </div>
              {/* 							<p className="absolute bottom-4">46 000 SEK*</p> */}
            </div>
            <div className="relative flex min-w-48 flex-1 flex-col rounded-lg bg-zinc-800 p-5 pb-32">
              <h3 className="font-lato text-2xl text-zinc-400">Silver</h3>
              <ul className="mt-2 font-lato text-zinc-500">
                <li className="my-2 font-extrabold">BRONZE PACKAGE</li>
                <li className="my-2">Silver priority placement</li>
                <li className="my-2">2x4 sqm. Carpeted Exhibitor Space</li>
                <li className="my-2">1200 W of Electricity</li>
                <li className="my-2">2 banquet tickets</li>
                <li className="my-2">2 Armada Run Tickets</li>
                <li className="my-2">
                  Silver Partner Marketing on THS Armada Platforms
                </li>
              </ul>
              <div className="absolute bottom-4">
                <p className="text-sm font-bold">
                  Priority Registration price:
                </p>
                <p>68 900 SEK*</p>
                <p className="text-sm">Standard registration price:</p>
                <p>75 800 SEK*</p>
              </div>
              {/* 							<p className="absolute bottom-4">71 500 SEK*</p> */}
            </div>
            <div className="relative flex min-w-48 flex-1 flex-col rounded-lg bg-yellow-800 p-5 pb-32">
              <h3 className="font-lato text-2xl text-yellow-400">Gold</h3>
              <ul className="mt-2 font-lato text-yellow-500">
                <li className="my-2 font-extrabold">SILVER PACKAGE</li>
                <li className="my-2">Gold priority placement</li>
                <li className="my-2">
                  2x5 sqm booth. Carpeted Exhibitor Space
                </li>
                <li className="my-2">2300 W of Electricity</li>
                <li className="my-2">
                  A spot in the Panel Discussion of your choice
                </li>
                <li className="my-2">Mass Email Campaign</li>
                <li className="my-2">2 Hours of Contact Calls (1:1)</li>
                <li className="my-2">4 Banquet Tickets</li>
                <li className="my-2">2 Armada Run Tickets</li>
                <li className="my-2">
                  Gold Partner Marketing on THS Armada Platforms
                </li>
              </ul>
              <div className="absolute bottom-4">
                <p className="text-sm">Priority Registration price:</p>
                <p>107 500 SEK*</p>
                <p className="text-sm">Standard registration price:</p>
                <p>118 200 SEK*</p>
              </div>
              {/* 							<p className="absolute bottom-4">108 500 SEK*</p> */}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm">*All prices are ex. VAT. </p>
        <div className="mx-auto mt-10 w-full max-w-[600px]">
          <h1 className="mb-2 ml-2 text-2xl">FAQ</h1>
          <Accordion type="single" collapsible={true}>
            <FAQItem title='What does "priority placement" mean?'>
              Priority placement means that we will place you in spots on the
              fair where there is good footfall. Gold exhibitors take the best
              spots and silver exhibitors are prioritized next. Contact{" "}
              <Link
                className="text-white underline hover:no-underline"
                href="mailto:sales@armada.nu">
                sales@armada.nu
              </Link>{" "}
              for more information.
            </FAQItem>

            <FAQItem title="When is the deadline for Priority Registration?">
              The Priority Registration ends {formatDate("2025-03-23")}. See our{" "}
              <Link
                className="text-white underline hover:no-underline"
                href="/exhibitor/timeline">
                timeline
              </Link>{" "}
              for more information and other important dates.
            </FAQItem>

            <FAQItem title="How do I sign up for armada?">
              <p>You can sign up here:</p>
              <div className="my-4">
                <Link href="https://register.armada.nu/register">
                  <Button>Signup to Armada</Button>
                </Link>
              </div>
              <p>
                If you have any questions, you can contact us at{" "}
                <Link
                  className="text-white underline hover:no-underline"
                  href="mailto:sales@armada.nu">
                  sales@armada.nu
                </Link>
                .
              </p>
            </FAQItem>
          </Accordion>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
