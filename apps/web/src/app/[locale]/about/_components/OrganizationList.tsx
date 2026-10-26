"use client"
import { useDraftState } from "@armada/shared/i18n/client"
import { useLocale, useTranslations } from "next-intl"
import { localizedText, normalizeLocale } from "@armada/shared/i18n/routing"
import { LocalizedText } from "@/i18n/text"

import PersonCard from "@/app/[locale]/about/_components/PersonCard"
import { Organization } from "@/components/shared/hooks/api/useOrganization"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

const OrganizationList = ({ group }: { group: Organization }) => {
  const locale = normalizeLocale(useLocale())
  const t = useTranslations("Organization")
  const [showOTs, setShowOTs] = useDraftState("members:" + group.name, false)

  const handleButtonClick = () => {
    setShowOTs(prevState => !prevState)
  }

  const rankText = (rank?: string | null) => (rank ?? "").toLowerCase().trim()

  const sortByRoleThenName = (
    a: { role?: string | null; name?: string | null },
    b: { role?: string | null; name?: string | null }
  ) => {
    const roleComparison = (a.role ?? "").localeCompare(
      b.role ?? "",
      undefined,
      {
        sensitivity: "base"
      }
    )

    if (roleComparison !== 0) return roleComparison

    return (a.name ?? "").localeCompare(b.name ?? "", undefined, {
      sensitivity: "base"
    })
  }

  const projectGroup = group.people.filter(person => {
    const rank = rankText(person.rank)
    return rank.includes("project group") || rank.includes("project manager")
  })
  const operationTeam = group.people.filter(person => {
    const rank = rankText(person.rank)
    return !(rank.includes("project group") || rank.includes("project manager"))
  })
  const hasMoreMembers = operationTeam.length > 0

  const sortedProjectGroup = [...projectGroup].sort(sortByRoleThenName)
  const sortedOperationTeam = [...operationTeam].sort(sortByRoleThenName)

  const groupDisplayName = localizedText(
    locale,
    group.name === "Project Manager"
      ? sortedProjectGroup.length > 1
        ? t("projectManagers")
        : t("projectManager")
      : group.name,
    group.nameSv
  )

  return (
    <div key={group.name} className="mt-16">
      <h2 className="font-bebas-neue text-3xl">{groupDisplayName}</h2>
      <div className="mt-5 flex flex-wrap items-start justify-center gap-6 md:justify-start">
        {sortedProjectGroup.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
      {showOTs && (
        <>
          {sortedProjectGroup.length > 0 && (
            <hr className="mt-6 border-stone-300/60" />
          )}
          <div className="mt-6 flex flex-wrap items-start justify-center gap-6 md:justify-start">
            {sortedOperationTeam.map(person => (
              <PersonCard
                key={person.id}
                person={person}
                compactWithoutPicture
              />
            ))}
          </div>
        </>
      )}
      {group.name !== "Project Manager" && hasMoreMembers && (
        <div className="mt-8 flex justify-center">
          <Button variant="neutral" onClick={handleButtonClick}>
            {showOTs ? (
              <>
                <ArrowLeftIcon className="mr-4 h-4 w-4" />
                <LocalizedText id="hideAdditionalMembers" />
              </>
            ) : (
              <>
                <LocalizedText id="showAdditionalMembers" />
                <ArrowRightIcon className="ml-4 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default OrganizationList
