import { Person } from "@/components/shared/hooks/api/useOrganization"
import { LinkedInIcon } from "@/components/shared/icons/LinkedInIcon"
import { Card } from "@/components/ui/card"
import { PersonIcon } from "@radix-ui/react-icons"
import { MailIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const PersonCard = ({ person }: { person: Person }) => {
  return (
    <>
      <Card
        key={person.id}
        className="w-full py-0 pb-4 transition-all hover:scale-105 sm:h-96 sm:w-56">
        {person.picture == null || person.picture.includes("no-image") ? (
          <div className="flex aspect-square w-52 flex-1 items-center justify-center">
            <PersonIcon className="text-melon-700 m-auto h-20 w-20" />
          </div>
        ) : (
          <div className="overflow-hidden">
            <Image
              loading="lazy"
              src={person.picture}
              alt={person.name}
              width={200}
              height={200}
              className="aspect-square w-full object-cover transition-all duration-200"
            />
          </div>
        )}
        <div className="px-4">
          <p className="text-melon-700">{person.name}</p>
          <p className="mt-1 text-sm text-stone-400">{person.role.trim()}</p>
          <div className="mt-2 flex gap-x-2">
            {person.email != null && (
              <Link href={`mailto:${person.email}`}>
                <MailIcon className="inline-block aspect-square w-5 text-stone-600 transition-colors hover:text-melon-700" />
              </Link>
            )}
            {person.linkedin_url != null && (
              <Link
                href={person.linkedin_url}
                target="_blank"
                rel="noopener noreferrer">
                <LinkedInIcon className="inline-block aspect-square w-5 ml-1 text-stone-600 transition-colors hover:text-melon-700" />
              </Link>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}
export default PersonCard
