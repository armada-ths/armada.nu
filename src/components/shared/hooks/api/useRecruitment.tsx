// import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export interface Recruitment {
  name: string
  link: string
  start_date: string
  end_date: string
  groups: Record<string, RecruitmentGroup[]>
}

interface RecruitmentGroup {
  name: string
  parent: null
  description: string
}

export async function fetchRecruitment(options?: RequestInit) {
  void options

  /*const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/recruitment`,
    options ?? {
      cache: "no-cache"
    }
  )
  const result = await res.json()
  if (result == null || !Array.isArray(result) || result.length <= 0)
    return null
  return result[0] as Recruitment*/

  //returning null when recruitment is not open

  const staticRecruitment: Recruitment = {
    name: "Operations Team 2026 Recruitment",
    link: "https://app.eventro.se/recruitments/your-recruitment-link", // Placeholder link
    start_date: "2026-02-01", // Placeholder start date
    end_date: "2026-07-01", // Placeholder end date
    groups: {
      "Marketing & Communication": [
        {
          name: "Graphic designer",
          parent: null,
          description:
            "As a graphic designer in Armada, you will shape the visual identity of KTH's largest student-run career fair. You will create campaign material for recruitment periods, social media launches, exhibitor communication, and events leading up to the fair. The role includes producing assets such as posters, digital screens, Instagram content, and presentation material used by teams across Armada. You will collaborate closely with the Marketing & Communication team to ensure a cohesive and impactful visual presence for Armada, contributing to the success of the fair and our events."
        }
      ]
    }
  }

  return staticRecruitment
}

export function useRecruitment(options?: RequestInit) {
  return useQuery({
    queryKey: ["recruitment"],
    queryFn: () => fetchRecruitment(options)
  })
}
