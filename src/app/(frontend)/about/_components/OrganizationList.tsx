"use client"
import PersonCard from "@/app/(frontend)/about/_components/PersonCard"
import { Organization } from "@/components/shared/hooks/api/useOrganization"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { useState } from "react"

const OrganizationList = ({ group }: { group: Organization }) => {
  const [showOTs, setShowOTs] = useState(false)

  const handleButtonClick = () => {
    setShowOTs(prevState => !prevState)
  }

  const rankText = (rank?: string | null) => (rank ?? "").toLowerCase().trim()

  const sortByRoleThenName = (a: { role?: string | null; name?: string | null }, b: { role?: string | null; name?: string | null }) => {
    const roleComparison = (a.role ?? "").localeCompare(b.role ?? "", undefined, {
      sensitivity: "base",
    })

    if (roleComparison !== 0) return roleComparison

    return (a.name ?? "").localeCompare(b.name ?? "", undefined, {
      sensitivity: "base",
    })
  }

  const projectGroup = group.people.filter(
    person => {
      const rank = rankText(person.rank)
      return rank.includes("project group") || rank.includes("project manager")
    }
  )
  const operationTeam = group.people.filter(person => {
    const rank = rankText(person.rank)
    return !(rank.includes("project group") || rank.includes("project manager"))
  })
  const hasMoreMembers = operationTeam.length > 0

  const sortedProjectGroup = [...projectGroup].sort(sortByRoleThenName)
  const sortedOperationTeam = [...operationTeam].sort(sortByRoleThenName)

  const groupDisplayName =
    group.name === "Project Manager" && sortedProjectGroup.length > 1
      ? "Project Managers"
      : group.name

  return (
    <div key={group.name} className="mt-16">
      <h2 className="font-bebas-neue text-3xl">{groupDisplayName}</h2>
      <div className="mt-5 flex flex-wrap items-start justify-center gap-6 md:justify-start">
        {sortedProjectGroup.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
        {showOTs &&
          sortedOperationTeam.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        <div className="my-20 flex justify-center">
          {group.name === "Project Manager" || !hasMoreMembers ? null : (
            <Button
              variant={"neutral"}
              className=""
              onClick={handleButtonClick}>
              {showOTs ? (
                <>
                  <ArrowLeftIcon className="mr-4 h-4 w-4" />
                  See Less Members
                </>
              ) : (
                <>
                  See More Members
                  <ArrowRightIcon className="ml-4 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrganizationList
