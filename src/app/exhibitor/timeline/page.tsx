import { ExhibitorTimeline } from "@/app/exhibitor/_components/ExhibitorTimeline"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"
import { translations, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { Metadata } from "next"

const timelinePageText: Record<
  Locale,
  { title: string; description: string; intro: string }
> = {
  en: {
    title: "Exhibitor Timeline - Armada",
    description:
      "From signup to fair, see what happens, step by step as an Armada exhibitor",
    intro:
      "The application is divided into 2 parts, Priority and Standard. Priority Registration is where you apply to exhibit at Armada, and in Standard Registration you choose your kit, events and other products. This is so we don't overfill the fair, and so we can prepare the best possible products for you!"
  },
  sv: {
    title: "Tidslinje för utställare - Armada",
    description:
      "Från anmälan till mässa, se vad som händer steg för steg som utställare på Armada",
    intro:
      "Anmälan är uppdelad i två delar: prioritet och standard. Prioritetsregistreringen är där ni ansöker om att ställa ut på Armada, och i standardregistreringen väljer ni kit, event och andra produkter. Det gör vi för att inte överfylla mässan och för att kunna förbereda bästa möjliga produkter för er."
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const dict = timelinePageText[locale]

  return {
    title: dict.title,
    description: dict.description
  }
}

export default async function ExhibitorTimelinePage() {
  const locale = await getRequestLocale()
  const dict = timelinePageText[locale]
  const showTimeline = await feature("EXHIBITOR_TIMELINE_PAGE")
  if (!showTimeline) {
    return <ComingSoonPage title={translations[locale].timeline} />
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={600} className="pb-20">
        <Page.Header>{dict.title.replace(" - Armada", "")}</Page.Header>
        <p className="mt-4">{dict.intro}</p>
        <ExhibitorTimeline />
        <div className="h-5" />
      </Page.Boundary>
    </Page.Background>
  )
}
