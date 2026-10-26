import { LocalizedText } from "@/i18n/text"
import { P } from "@/app/_components/Paragraph"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"

export function Testimonial() {
  return (
    <Card className="bg-snow mx-auto max-w-175 p-6 shadow-none">
      <div>
        {/* Quote icon */}
        <QuoteIcon size={12} className="mb-2 opacity-60" />

        {/* Quote */}
        <P className="mb-6 text-sm">
          <LocalizedText id="itsImportantForMeToBeAround" />
        </P>

        {/* Attribution */}
        <div className="flex justify-end">
          <div className="flex items-center gap-3 text-right">
            <div className="leading-tight">
              <p className="text-sm font-semibold">
                Hampus Hallkvist{" "}
                <span className="opacity-60">
                  <LocalizedText id="dchapter" />
                </span>
              </p>
              <p className="text-xs opacity-70">PG23 & PG24</p>
            </div>

            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage
                src="/hampus.jpg"
                alt="Hampus Hallkvist"
                className="object-cover"
              />
            </Avatar>
          </div>
        </div>
      </div>
    </Card>
  )
}
