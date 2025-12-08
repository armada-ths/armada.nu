"use client"
import PersonCard from "@/app/about/_components/PersonCard"
import { Organization } from "@/components/shared/hooks/api/useOrganization"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { useState } from "react"

const OrganizationList = ({ group }: { group: Organization }) => {
  const [showOTs, setShowOTs] = useState(false)

  const handleButtonClick = () => {
    setShowOTs(prevState => !prevState)
  }

  const projectGroup = group.people.filter(
    person =>
      person.role.toLowerCase().includes("project group") ||
      person.role.toLowerCase().includes("project manager")
  )
  const operationTeam = group.people.filter(person =>
    person.role.toLowerCase().includes("operation team")
  )

  return (
    <div key={group.name} className="mt-16">
      <h2 className="font-bebas-neue text-3xl">{group.name}</h2>
      <div className="mt-5 flex flex-wrap items-start justify-center gap-6 md:justify-start">
        {projectGroup.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
        {showOTs &&
          operationTeam.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        <div className="my-20 flex justify-center">
          {group.name === "Project Manager" ? null : (
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
