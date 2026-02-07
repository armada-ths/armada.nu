import { P } from "@/app/_components/Paragraph"
import { PhotoSlideCarousel } from "@/app/_components/PhotoSlideCarousel"
import { CurrentStatus } from "@/app/exhibitor/_components/CurrentStatus"
import { getSignupUrl } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"
import { VisitorNumberBar } from "@/components/shared/VisitorNumberBar"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Become an exhibitor at Armada`
}

export default async function ForExhibitorsPage() {
  const signupUrl = await getSignupUrl()
  const promotionalPhotos: { source: string; altText: string }[] = [
    {
      source: "/fair_pictures/49121473038_5876d71e29_b.jpg",
      altText: "Student talking to company representative"
    },
    {
      source: "/fair_pictures/49121988801_f0b111943f_k.jpg",
      altText: "Crowded room of students attending the fair"
    },
    {
      source: "/fair_pictures/49122130686_297ea7d00a_o.jpg",
      altText: "Student interacting with robot"
    },
    {
      source: "/fair_pictures/53396499463_86ddb61379_k.jpg",
      altText: "Student talking with company representative"
    }
  ]
  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={600} className="pb-20">
        <Page.Header tier="primary">Why Armada</Page.Header>
        <div className="h-4" />

        <VisitorNumberBar />

        <div className="flex flex-col space-y-4 py-6">
          <div className="mt-2 flex flex-row flex-wrap justify-stretch gap-4">
            <Button asChild className="bg-grapefruit">
              <Link href={signupUrl}>
                Signup to Armada
              </Link>
            </Button>
            <Button asChild variant={"neutral"}>
              <Link href="/exhibitor/packages">
                Packages
              </Link>
            </Button>
            <Button asChild variant={"neutral"}>
              <Link href="/exhibitor/timeline">
                Timeline
              </Link>
            </Button>
          </div>
          <p className="text-xs">
            Or{" "}
            <Link
              className="underline hover:no-underline"
              href="mailto:sales@armada.nu">
              contact sales
            </Link>{" "}
            if you have any questions
          </p>
        </div>
        <div className="mt-2">
          <CurrentStatus />
        </div>
        <section className="flex flex-col gap-y-10">
          <div className="mt-6">
            <h2 className="font-bebas-neue text-melon-700 text-3xl font-medium">
              New students, every year!
            </h2>
            <P>
              Every year, around 4000 new students come to KTH. Almost as many
              students get their first full time job or internship.
              Participating in Armada means you get access to all of them, and
              can both build awareness among younger students and be top of mind
              when the older students start looking for a job. Welcome!
            </P>
          </div>

          <div className="mt-6">
            <h2 className="font-bebas-neue text-melon-700 text-3xl font-medium">
              Do you write &quot;we place high importance on your personal
              character&quot; in job ads?
            </h2>
            <P>
              Armada realizes that what you study does not always decide where
              you end up in your career. Employers today must be attractive to a
              broad range of workers to recruit a diverse team and because you
              never know, your next star employee might have a different degree
              than you thought!
            </P>
          </div>
          <div className="mt-6">
            <h2 className="font-bebas-neue text-melon-700 text-3xl font-medium">
              Skills you need, from all ends of KTH
            </h2>
            <P>
              Did you know that there are at least five programmes at KTH
              teaching computer science and students from more than three
              programmes can call themselves “mechanical engineers” when
              applying for jobs?
            </P>
          </div>
        </section>
        <PhotoSlideCarousel photoSrc={promotionalPhotos} />
      </Page.Boundary>
    </Page.Background>
  )
}
