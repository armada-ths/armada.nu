import { P } from "@/app/(frontend)/_components/Paragraph"
import { Person } from "@/components/shared/hooks/api/useOrganization"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function Profile({ profile }: { profile: Person }) {
  return (
    <Card className="bg-melon-700 p-6">
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
          <p className="text-sm opacity-80">Project Manager, Armada 2026</p>
        </div>
      </div>
      <div className="sm:hidden">
        <P className="text-sm">
          Hi, my name is {profile.name?.split(" ")[0] ?? ""} and I’m the project
          manager for Armada 2026. I’m determined to challenge myself and the
          rest of the project group in making the best Armada in many years. If
          you want to know more about my vision or you have any other questions
          surrounding the project group,{" "}
          <Link
            className="underline hover:no-underline"
            href={`mailto:${profile.email}`}>
            contact me
          </Link>{" "}
          and we’ll grab a coffee!
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
            Project Manager, Armada 2026
          </p>

          <P className="text-base">
            Hi, my name is {profile.name?.split(" ")[0] ?? ""} and I’m the
            project manager for Armada 2026. I’m determined to challenge myself
            and the rest of the project group in making the best Armada in many
            years. If you want to know more about my vision or you have any
            other questions surrounding the project group,{" "}
            <Link
              className="underline hover:no-underline"
              href={`mailto:${profile.email}`}>
              contact me
            </Link>{" "}
            and we’ll grab a coffee!
          </P>
        </div>
      </div>
    </Card>
  )
}
