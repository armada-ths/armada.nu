import { LocalizedText } from "@/i18n/text"
import { P } from "@/app/_components/Paragraph"
import { Person } from "@/components/shared/hooks/api/useOrganization"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Link } from "@armada/shared/i18n/navigation"

export function Profile({ profile }: { profile: Person }) {
  return (
    <Card className="bg-melon p-6">
      {/* Mobile header */}
      <div className="flex items-center gap-3 sm:hidden">
        <Avatar className="h-22 w-22 shrink-0">
          <AvatarImage
            src={profile.picture}
            alt={profile.name}
            className="object-cover"
          />
        </Avatar>
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm opacity-80">
            <LocalizedText id="projectManagerArmada2026" />
          </p>
        </div>
      </div>
      <div className="sm:hidden">
        <P className="text-sm">
          <LocalizedText id="hiMyNameIs" />
          {profile.name?.split(" ")[0] ?? ""}{" "}
          <LocalizedText id="andImTheProjectManagerForArmada" />{" "}
          <Link
            className="underline hover:no-underline"
            href={`mailto:${profile.email}`}>
            <LocalizedText id="contactMe" />
          </Link>{" "}
          <LocalizedText id="andWellGrabACoffee" />
        </P>
      </div>

      {/* Desktop layout (unchanged) */}
      <div className="hidden sm:flex sm:items-start sm:gap-6">
        <Avatar className="h-48 w-48 shrink-0">
          <AvatarImage
            src={profile.picture}
            alt={profile.name}
            className="object-cover"
          />
        </Avatar>

        <div className="max-w-prose">
          <p className="mt-1.5 font-semibold">{profile.name}</p>
          <p className="mb-4 text-sm opacity-80">
            <LocalizedText id="projectManagerArmada2026" />
          </p>

          <P className="text-base">
            <LocalizedText id="hiMyNameIs" />
            {profile.name?.split(" ")[0] ?? ""}{" "}
            <LocalizedText id="andImTheProjectManagerForArmada" />{" "}
            <Link
              className="underline hover:no-underline"
              href={`mailto:${profile.email}`}>
              <LocalizedText id="contactMe" />
            </Link>{" "}
            <LocalizedText id="andWellGrabACoffee" />
          </P>
        </div>
      </div>
    </Card>
  )
}
