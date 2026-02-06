import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"

export const COMING_SOON_TEXT = "More information coming soon"

interface ComingSoonPageProps {
    title: string
    description?: string
}

export function ComingSoonPage({
    title,
    description = COMING_SOON_TEXT
}: ComingSoonPageProps) {
    return (
        <Page.Background withIndents>
            <Page.Boundary className="pb-20">
                <div className="mx-auto max-w-[600px] text-center">
                    <Page.Header>{title}</Page.Header>
                    <P className="mt-4">{description}</P>
                </div>
            </Page.Boundary>
        </Page.Background>
    )
}
